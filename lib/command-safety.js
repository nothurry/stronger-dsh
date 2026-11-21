import path from "node:path";
import { homedir } from "node:os";
function segments(source) {
  const result = [];
  let tokens = [], word = "", quote = null;
  const wordDone = () => {
    if (word) {
      tokens.push(word);
      word = "";
    }
  };
  const commandDone = () => {
    wordDone();
    if (tokens.length) result.push(tokens);
    tokens = [];
  };
  for (let index = 0; index < source.length; index++) {
    const character = source[index];
    if (character === "`" && index + 1 < source.length) {
      word += source[++index];
      continue;
    }
    if (quote) {
      if (character === quote) quote = null;
      else word += character;
      continue;
    }
    if (character === '"' || character === "'") {
      quote = character;
      continue;
    }
    if (character === "\\" && source[index + 1] === "\n") {
      index++;
      continue;
    }
    if (/[;&|\n\r{}()]/.test(character)) {
      commandDone();
      continue;
    }
    if (/\s/.test(character)) {
      wordDone();
      continue;
    }
    if (character === "#" && !word) {
      while (index < source.length && source[index] !== "\n") index++;
      commandDone();
      continue;
    }
    word += character;
  }
  commandDone();
  return result;
}
function executable(token) {
  return token.replaceAll("\\", "/").split("/").at(-1).toLowerCase().replace(/\.(?:exe|com|cmd|bat)$/, "");
}
function broadTarget(token) {
  const value = token.replaceAll("\\", "/").replace(/^--(?:literal-)?path=/i, "").replace(/^['"]|['"]$/g, "").toLowerCase();
  if (value.replace(/\/\*?$|\*$/, "") === homedir().replaceAll("\\", "/").toLowerCase().replace(/\/$/, "")) return true;
  return /^(?:\/+\*?|[a-z]:\/?\*?|~\/?\*?|\$(?:\{home\}|home|env:userprofile)\/?\*?|%userprofile%\/?\*?)$/.test(value) || /^\/[a-z]:?$/.test(value) || /^\/(?:home|users|windows|etc|usr|bin|boot|system|system32)\/?\*?$/.test(value) || /^[a-z]:\/(?:users|windows|program files(?: \(x86\))?)\/?\*?$/.test(value);
}
function restriction(code, reason) {
  return { code, reason };
}
function inspectTokens(tokens, depth) {
  const name = executable(tokens[0]), args = tokens.slice(1), lower = args.map((value) => value.toLowerCase());
  if (["powershell", "pwsh"].includes(name) && lower.some((value) => /^-(?:e|en|enc|enco|encod|encode|encoded|encodedc|encodedco|encodedcom|encodedcomm|encodedcomma|encodedcomman|encodedcommand)$/.test(value))) return restriction("SAFETY_ENCODED_COMMAND", "禁止通过编码 PowerShell 指令执行混淆操作，请提交可直接审查的明文指令");
  if (["format", "mkfs", "fdisk", "sfdisk", "parted", "clear-disk", "initialize-disk", "remove-partition", "format-volume"].includes(name) || name.startsWith("mkfs.")) {
    if (!(args.length === 1 && ["/?", "--help", "-h"].includes(lower[0]))) return restriction("SAFETY_DISK_DESTRUCTION", "禁止模型执行磁盘格式化、分区删除或磁盘初始化");
  }
  if (name === "diskpart" && !lower.includes("/?")) return restriction("SAFETY_DISK_DESTRUCTION", "禁止模型直接执行磁盘分区脚本");
  const recursive = lower.some((value) => /^-(?:recurse|r|rf|fr|rfi|fir|rforce|force)$/.test(value) || value === "/s" || /^--recursive/.test(value));
  if (["rm", "remove-item", "ri", "del", "erase", "rd", "rmdir"].includes(name) && args.some(broadTarget)) return restriction("SAFETY_BROAD_DELETION", "禁止删除系统根目录、用户主目录或整个人员与系统目录");
  if (["rm", "remove-item", "ri", "del", "erase", "rd", "rmdir"].includes(name) && recursive && args.some((value) => /\$|%[a-z_][\w]*%/i.test(value))) return restriction("SAFETY_DYNAMIC_DELETION", "递归删除目标含未解析的变量或命令替换，请先核对并使用明确的绝对路径");
  if (name === "set-mppreference" && lower.some((value) => value.startsWith("-disable")) && lower.some((value) => /(?:^|:)\$?(?:true|1)$/.test(value))) return restriction("SAFETY_DISABLE_DEFENSE", "禁止模型关闭系统恶意软件防护");
  if (["add-mppreference", "set-mppreference"].includes(name) && lower.some((value) => /^-exclusion(?:path|process|extension|ipaddress)(?::|$)/.test(value))) return restriction("SAFETY_DISABLE_DEFENSE", "禁止模型添加或改写系统安全防护排除项");
  if (name === "set-netfirewallprofile" && lower.some((value) => /^-enabled(?::|$)/.test(value)) && lower.some((value) => /(?:^|:)\$?(?:false|0)$/.test(value))) return restriction("SAFETY_DISABLE_DEFENSE", "禁止模型关闭防火墙");
  if (name === "netsh" && lower.includes("advfirewall") && lower.includes("off")) return restriction("SAFETY_DISABLE_DEFENSE", "禁止模型关闭防火墙");
  if (["stop-service", "set-service", "sc", "net"].includes(name) && lower.some((value) => ["windefend", "mpssvc", "sense", "securityhealthservice"].includes(value)) && (name === "stop-service" || lower.some((value) => ["stop", "disabled", "disable", "delete"].includes(value) || /^start=disabled$/.test(value)))) return restriction("SAFETY_DISABLE_DEFENSE", "禁止模型停止或禁用系统安全服务");
  if (name === "bcdedit" && (lower.includes("/delete") || lower.includes("nointegritychecks") && lower.includes("on"))) return restriction("SAFETY_BOOT_SECURITY", "禁止模型删除引导配置或关闭系统完整性检查");
  if (name === "reg" && lower[0] === "delete" && args.some((value) => /^hk(?:lm|ey_local_machine)[\\/](?:system|sam|security)(?:[\\/]|$)/i.test(value))) return restriction("SAFETY_PROTECTED_SYSTEM", "禁止模型删除系统安全注册表分支");
  if (["curl", "wget", "invoke-restmethod", "invoke-webrequest"].includes(name) && args.some((value) => credentialPath(value.replace(/^@/, "")))) return restriction("SAFETY_CREDENTIAL_TRANSFER", "禁止通过网络工具传送私钥或本机凭据存储");
  if (["cat", "type", "get-content", "gc", "more", "head", "tail", "copy", "copy-item", "cp"].includes(name) && args.some(credentialPath)) return restriction("SAFETY_PROTECTED_CREDENTIAL", "禁止模型通过命令读取或复制私钥及本机凭据存储");
  if (depth < 3 && ["powershell", "pwsh", "bash", "sh", "cmd", "sudo", "env"].includes(name)) {
    const index = lower.findIndex((value) => ["-command", "-c", "/c", "-lc"].includes(value));
    const nested = index >= 0 ? args.slice(index + 1).join(" ") : args.filter((value) => !value.startsWith("-")).join(" ");
    if (nested) {
      const found = inspectCommand(nested, depth + 1);
      if (found) return found;
    }
  }
  return null;
}
function inspectCommand(source, depth = 0) {
  for (const command of segments(source)) {
    const found = inspectTokens(command, depth);
    if (found) return found;
  }
  return null;
}
function credentialPath(value) {
  const normalized = value.replaceAll("\\", "/").toLowerCase();
  return /(?:^|\/)\.ssh\/(?:id_(?:rsa|dsa|ecdsa|ed25519)|[^/]+\.pem)$/.test(normalized) || /(?:^|\/)\.aws\/credentials$/.test(normalized) || /(?:^|\/)\.codex\/auth\.json$/.test(normalized) || /(?:^|\/)\.dsh\/(?:\.credentials\.ya?ml|channel-pack\/state\.json)$/.test(normalized);
}
export function guardianPath(value){return /(?:^|\/)plugins-data\/dsh-ui-stronger\/(?:team-guardian\.json|guardian-[a-f0-9-]{36}\.jsonl(?:\.previous)?)$/i.test(String(value).replaceAll('\\','/'));}
function actionRestriction(exec) {
  const arguments_ = exec.arguments;
  if (!arguments_ || typeof arguments_ !== "object") return null;
  if(/ui-stronger\/setTeamMemberPermission/.test(JSON.stringify(arguments_)))return restriction('SAFETY_POLICY_SELF_CHANGE','子智能体权限只能由用户设置');
  if(/ui-stronger\/(?:teamGuardian|configureTeamGuardian|teamGuardianPause|teamGuardianResume)/.test(JSON.stringify(arguments_)))return restriction('SAFETY_AUDITOR_ISOLATION','独立审查的配置与记录仅供用户界面访问，模型不得读取或控制');
  for (const key of ["command", "cmd", "script", "shell_command"]) {
    if (typeof arguments_[key] !== "string") continue;
    if(/plugins-data[\\/]dsh-ui-stronger[\\/](?:team-guardian\.json|guardian-[a-f0-9-]{36}\.jsonl)/i.test(arguments_[key]))return restriction('SAFETY_AUDITOR_ISOLATION','禁止模型通过命令访问独立审查的配置与记录');
    const found = inspectCommand(arguments_[key]);
    if (found) return found;
  }
  for (const key of ["file_path", "path", "filename", "target_path"]) {
    const target = arguments_[key];
    if (typeof target !== "string") continue;
    if(guardianPath(target))return restriction('SAFETY_AUDITOR_ISOLATION','独立审查配置与日志不向工作智能体开放');
    if (credentialPath(target)) return restriction("SAFETY_PROTECTED_CREDENTIAL", "禁止模型直接读取或改写私钥及本机凭据存储，请使用宿主凭据接口");
    const normalized = path.resolve(exec.agent?.session?.header?.cwd ?? ".", target).replaceAll("\\", "/").toLowerCase();
    if (!/^(?:read|stat|list|glob|grep|search)/i.test(exec.name) && /\/\.dsh\/plugins-data\/dsh-ui-stronger\/(?:team-mode|team-guardian|safety-policy|model-access|intelligence|workspace)\.json$/.test(normalized)) return restriction("SAFETY_POLICY_SELF_CHANGE", "禁止模型通过文件工具修改安全策略与权限开关，请由用户在设置页操作");
  }
  return null;
}
export {
  actionRestriction,
  credentialPath
};
