window.__ModuleLoader__.load({id:'dsh-ui-stronger',factory:require=>{
 const React=require('react'),ReactDOM=require('react-dom'),h=React.createElement;
 const {FishLogo,BrandWordmark,MenuItemButton,Menu,Modal,Button}=require('@deepseek-ai/dsh-client-ui-primitives');
 const CSS=`
html[data-ui-stronger]{--zw-radius:14px}
html[data-ui-stronger] :where(.zw-panel,.zs-tools,.zs-palette,.zs-welcome,.zw-controls,.zs-process,.zs-home-modules) :where(button,input,select,textarea,[role=button],[role=combobox],[role=dialog]:where(.zs-tools,.zs-tools *,.zs-palette,.zs-palette *,.zw-panel,.zw-panel *),[role=menu]:where(.zs-tools,.zs-tools *,.zs-palette,.zs-palette *,.zw-panel,.zw-panel *),[role=tooltip]:where(.zs-tools,.zs-tools *,.zs-palette,.zs-palette *,.zw-panel,.zw-panel *)){border-radius:var(--zw-radius)!important}
html[data-ui-stronger] [class*=_centerCol],html[data-ui-stronger] [class*=_sidebarCol],html[data-ui-stronger] [class*=_inputBar],html[data-ui-stronger] [class*=_composerCard],html[data-ui-stronger] [data-code-block-banner]{border-radius:var(--zw-radius)!important}
html[data-ui-stronger] .LOmM4q_bubble{border-radius:14px!important}

html[data-ui-stronger]{--zw-radius:14px}
html[data-ui-stronger] :where(.zw-panel,.zs-tools,.zs-palette,.zs-welcome,.zw-controls,.zs-process,.zs-home-modules) :where(button,[role=button],input,textarea,select){border-radius:var(--zw-radius)!important}
html[data-ui-stronger] [class*=_sidebarCol],html[data-ui-stronger] [class*=_centerCol],html[data-ui-stronger] [class*=_inputBar],html[data-ui-stronger] [class*=_composerCard],html[data-ui-stronger] .LOmM4q_bubble,html[data-ui-stronger] [data-code-block-banner]{border-radius:var(--zw-radius)!important}
html[data-ui-stronger] .zw-frame{border-radius:20px;background:none!important;border:1px solid var(--zw-line)!important;opacity:.75!important}

 html[data-ui-stronger] {--zw-paper:#f8f8f7;--zw-panel:#efeff0;--zw-ink:#25242a;--zw-muted:#85818d;--zw-line:#dedce2;--zw-purple:#9278b1;--zw-soft:#eae5f1;--zw-deep:#6f568f}
 html[data-ui-stronger] [data-ds-dark-theme],html[data-ui-stronger][data-ds-dark-theme] {--zw-paper:#151518;--zw-panel:#1c1c21;--zw-ink:#e2e0e7;--zw-muted:#95909f;--zw-line:#323037;--zw-soft:#302938;--zw-deep:#baa3d2}
 html[data-ui-stronger],html[data-ui-stronger] body,html[data-ui-stronger] [data-ds-dark-theme] {
 --dsw-alias-bg-base:var(--zw-paper)!important;--dsw-specific-sidebar-fill:var(--zw-panel)!important;--dsw-alias-bg-layer-1:var(--zw-paper)!important;--dsw-alias-bg-layer-2:var(--zw-panel)!important;--dsw-alias-bg-module-platform:var(--zw-panel)!important;
 --dsw-static-blue-50:#f2eef7!important;--dsw-static-blue-100:#e9e2f1!important;--dsw-static-blue-450:var(--zw-purple)!important;--dsw-static-blue-500:var(--zw-deep)!important;--dsw-alias-brand-primary:var(--zw-deep)!important;--dsw-alias-button-primary-fill:var(--zw-deep)!important;--dsw-alias-button-primary-hover:var(--zw-purple)!important;--dsw-alias-button-primary-dimmed:var(--zw-soft)!important;--dsw-alias-state-business-tertiary:var(--zw-soft)!important;--dsw-alias-label-primary-bluish:var(--zw-ink)!important;--dsw-alias-label-primary:var(--zw-ink)!important;--dsw-alias-label-secondary:var(--zw-muted)!important;--dsw-alias-state-business-primary:var(--zw-deep)!important;--dsw-alias-border-l2:var(--zw-line)!important;--dsw-alias-border-l3:var(--zw-line)!important;--dsw-alias-border-l4:var(--zw-line)!important;--dsw-specific-bubble:var(--zw-soft)!important;
 --dsw-alias-interactive-bg-hover:color-mix(in srgb,var(--zw-purple) 9%,transparent)!important;--dsw-focus-ring-color:var(--zw-purple)!important;--dsw-radius-xl:10px;--dsw-radius-lg:8px;--dsh-chat-content-width:800px;
 }
 html[data-ui-stronger] [class*="_sidebarCol"]{border-right:1px solid var(--zw-line)!important}
 html[data-ui-stronger] [class*="_centerCol"]{border-radius:var(--zw-radius)}
 html[data-ui-stronger] .WOwLGG_headline{gap:16px;padding:14px 0 24px} html[data-ui-stronger] .WOwLGG_titleGroup{font-weight:450}
 html[data-ui-stronger] .LOmM4q_bubble{border:1px solid color-mix(in srgb,var(--zw-purple) 13%,var(--zw-line));border-radius:var(--zw-radius);padding:12px 17px}
 html[data-ui-stronger] [data-code-block-banner]{border-color:var(--zw-line)}
 html[data-ui-stronger] :where(.zw-panel,.zs-tools,.zs-palette,.zs-welcome,.zw-controls,.zs-process,.zs-home-modules) :where(button,input,textarea,[contenteditable=true]){accent-color:var(--zw-purple)}
 html[data-ui-stronger] :where(.zw-panel,.zs-tools,.zs-palette,.zs-welcome,.zw-controls,.zs-process,.zs-home-modules) :where(button):focus-visible{outline:2px solid var(--zw-purple);outline-offset:3px}
 html[data-ui-stronger] [class*="_inputBar"],html[data-ui-stronger] [class*="_composerCard"]{box-shadow:0 2px 12px #00000004;border-color:var(--zw-line)}
 html[data-ui-stronger][data-ui-stronger-motion] .V4vHZW_runningIcon{animation:zw-breathe 3.8s ease-in-out infinite}
 .zw-hero-mark{display:grid;place-items:center;position:relative;width:62px;height:62px;background:linear-gradient(var(--zw-line),var(--zw-line)) left top/8px 1px no-repeat,linear-gradient(var(--zw-line),var(--zw-line)) left top/1px 8px no-repeat,linear-gradient(var(--zw-line),var(--zw-line)) right bottom/8px 1px no-repeat,linear-gradient(var(--zw-line),var(--zw-line)) right bottom/1px 8px no-repeat}
 .zw-frame{position:absolute;inset:calc(var(--dsh-frame-chrome-top,0px) + 10px) 10px 10px 66px;pointer-events:none!important;z-index:0;background:linear-gradient(var(--zw-line),var(--zw-line)) right top/10px 1px no-repeat,linear-gradient(var(--zw-line),var(--zw-line)) right top/1px 10px no-repeat,linear-gradient(var(--zw-line),var(--zw-line)) left bottom/10px 1px no-repeat,linear-gradient(var(--zw-line),var(--zw-line)) left bottom/1px 10px no-repeat;opacity:.65}
 html[data-ui-stronger] .LOmM4q_bubble{box-shadow:none}
 html[data-ui-stronger] .WOwLGG_stack{gap:18px}
 html[data-ui-stronger] .WOwLGG_headline{letter-spacing:.5px}
 html[data-ui-stronger] [data-code-block-banner]{background:var(--zw-panel)}
 html[data-ui-stronger][data-ui-stronger-motion] :where(button){transition:background-color .15s ease,border-color .15s ease,color .15s ease}
 .zw-mark{display:block;color:var(--zw-purple,#9278b1);overflow:visible;flex-shrink:0}
 .zw-name{display:flex;flex-direction:column;gap:4px;color:var(--zw-ink,#25242a);font-size:15px;letter-spacing:3px;font-weight:550}
 .zw-name small{font:8px ui-monospace,monospace;letter-spacing:2.4px;opacity:.5}
 .zw-hero{display:grid;place-items:center;gap:14px;position:relative;margin-bottom:12px}
 .zw-hero:before,.zw-hero:after{content:'';position:absolute;top:48%;width:60px;height:1px;background:var(--zw-line);left:calc(50% + 80px)}.zw-hero:after{left:auto;right:calc(50% + 80px)}
 .zw-hero>span{white-space:nowrap}.zw-hero small{font:9px ui-monospace,monospace;letter-spacing:3px;color:var(--zw-muted)}
 [data-ui-stronger-motion] .zw-hero-mark .zw-mark{animation:zw-breathe 6.8s ease-in-out infinite}
 .zw-controls{display:flex;align-items:center;gap:5px;font:10px ui-monospace,monospace;color:var(--zw-muted)}
 .zw-control,.zw-panel button{border:1px solid var(--zw-line,#ddd);background:transparent;color:inherit;border-radius:var(--zw-radius);padding:6px 9px;cursor:pointer;font:inherit;display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:30px}
 .zw-control:hover,.zw-panel button:hover{background:var(--zw-soft,#eee9f4);color:var(--zw-deep,#71558e)}.zw-control[aria-pressed=true]{color:var(--zw-deep);background:var(--zw-soft)}
 .zw-control svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}
 .zw-control:disabled{opacity:.4;cursor:default}.zw-live{width:4px;height:4px;background:var(--zw-purple);transform:rotate(45deg);margin-right:4px}.zw-controls[data-busy=true] .zw-live{animation:zw-breathe 1.7s ease-in-out infinite}
 .zw-panel{max-width:700px;padding:22px 4px;color:var(--zw-ink,inherit);line-height:1.7;font-size:13px}.zw-panel header{display:flex;flex-wrap:wrap;align-items:center;gap:22px;padding-bottom:28px;border-bottom:1px solid var(--zw-line,#ddd)}.zw-panel h2{font-size:24px;letter-spacing:5px;font-weight:500;margin:4px 0}.zw-panel small{font:9px ui-monospace,monospace;letter-spacing:2px;color:var(--zw-muted)}
 .zw-connect{padding:20px 0;border-bottom:1px solid var(--zw-line,#ddd)}.zw-connect summary{cursor:pointer;color:var(--zw-deep,#71558e);font-size:13px}.zw-connect form{display:grid;gap:12px;margin:16px 0}.zw-connect label{display:grid;gap:6px;font-size:12px;min-width:0}.zw-connect input{width:100%;box-sizing:border-box;border:1px solid var(--zw-line,#ddd);border-radius:var(--zw-radius);background:var(--zw-paper,#fff);color:var(--zw-ink,#25242a);padding:9px 10px;font-family:inherit;font-size:12px}.zw-connect button{justify-self:start}.zw-panel p{color:var(--zw-muted)}.zw-setting{display:flex;justify-content:space-between;gap:20px;align-items:center;padding:19px 0;border-bottom:1px solid var(--zw-line,#ddd)}.zw-setting div{display:grid;gap:3px;min-width:0}.zw-setting span{color:var(--zw-muted);font-size:12px}.zw-panel button[role=switch]{box-sizing:border-box;flex-shrink:0;width:39px;height:22px;min-height:22px;border-radius:var(--zw-radius);padding:3px;justify-content:flex-start}.zw-panel button[role=switch]:before{content:'';width:14px;height:14px;border-radius:var(--zw-radius);background:var(--zw-muted);transition:transform .18s}.zw-panel button[aria-checked=true]{background:var(--zw-soft);border-color:var(--zw-purple)}.zw-panel button[aria-checked=true]:before{background:var(--zw-purple);transform:translateX(15px)}
 .zw-error{font-size:12px;color:#b15a6e;max-width:320px;white-space:normal}.zw-panel .zw-note{padding:14px 0;font-size:12px}

 .zw-pet{position:absolute;bottom:170px;right:20px;width:120px;display:flex;flex-direction:column;align-items:center;pointer-events:auto;touch-action:none;user-select:none;cursor:grab;z-index:8}.zw-pet img{width:104px;height:146px;object-fit:contain;pointer-events:none;transform-origin:50% 90%}.zw-pet small{font:8px ui-monospace,monospace;letter-spacing:2px;color:var(--zw-muted);padding:5px 8px;border-top:1px solid var(--zw-line);background:var(--zw-paper)}[data-ui-stronger-motion] .zw-pet img{animation:zw-pet 6.3s ease-in-out infinite}.zw-pet[data-busy=true] img{animation-duration:3.1s}.zw-pet:active{cursor:grabbing}.zw-pet button{position:absolute;top:0;right:0;border:1px solid var(--zw-line);border-radius:var(--zw-radius);background:var(--zw-paper);color:var(--zw-muted);cursor:pointer;width:20px;height:20px;opacity:0}.zw-pet:hover button,.zw-pet:focus-within button{opacity:1}
 @keyframes zw-arrive{from{opacity:.25;transform:translateY(5px)}to{opacity:1;transform:none}}@keyframes zw-breathe{0%,100%{opacity:.72;transform:translateY(0)}40%{opacity:1;transform:translateY(-1px)}}@keyframes zw-pet{0%,100%{transform:translateY(0) rotate(-.15deg) scaleY(1)}42%{transform:translateY(-1.5px) rotate(.2deg) scaleY(1.006)}70%{transform:translateY(-.4px) rotate(0)}}
 @media(max-width:650px){.zw-controls .zw-readiness{display:none}.zw-pet{width:80px;right:10px;bottom:155px}.zw-pet img{width:72px;height:100px}}html:not([data-ui-stronger-motion]) .zw-pet *,html:not([data-ui-stronger-motion]) .zw-controls *{animation:none!important;transition:none!important}
 @media(prefers-reduced-motion:reduce){html[data-ui-stronger] :where(.zw-panel,.zs-tools,.zs-palette,.zs-welcome,.zw-controls,.zs-process,.zs-home-modules) *,html[data-ui-stronger] :where(.zw-panel,.zs-tools,.zs-palette,.zs-welcome,.zw-controls,.zs-process,.zs-home-modules) *:before,html[data-ui-stronger] :where(.zw-panel,.zs-tools,.zs-palette,.zs-welcome,.zw-controls,.zs-process,.zs-home-modules) *:after{animation:none!important;transition:none!important}}
 
html[data-ui-stronger] .wnFoaW_rowQuickActions{display:none!important}
html[data-ui-stronger] .zs-delete-label{display:inline-flex;align-items:center;gap:8px}
html[data-ui-stronger] .zs-delete-label svg{width:16px;height:16px;flex:none;opacity:.78}
html[data-ui-stronger] .zs-delete-copy{font-size:13px;line-height:1.7;color:var(--dsw-alias-label-secondary,#73737b);margin:0}
html[data-ui-stronger] .zs-delete-error{font-size:12px;line-height:1.6;color:var(--dsw-alias-state-error-primary,#ad475d);margin:12px 0 0;overflow-wrap:anywhere}
html[data-ui-stronger] .zs-delete-confirm:not(:disabled){color:var(--dsw-alias-state-error-primary,#ad475d);--dsh-button-outline-color:var(--dsw-alias-state-error-primary,#ad475d)}

.zs-model-wait{display:flex;align-items:center;gap:16px;padding:20px 0;font-size:13px;line-height:1.7;color:var(--zw-muted)}

/* Preserve full native dock readings while sharing space with the conversation total. */
html[data-ui-stronger] [data-composer-dock]{flex-wrap:wrap;justify-content:flex-start;gap:6px 12px;min-width:0}
html[data-ui-stronger] [data-composer-stat]{flex:0 1 auto;max-width:100%;min-width:0}
html[data-ui-stronger] [data-composer-stat] .hNGZaa_pill{max-width:100%;white-space:normal;align-items:flex-start}
html[data-ui-stronger] [data-composer-stat] .hNGZaa_label{white-space:normal;overflow:visible;text-overflow:clip;overflow-wrap:anywhere}
html[data-ui-stronger] [data-composer-dock] .zs-session-tokens{width:auto;flex:0 1 auto;margin-inline-start:auto;white-space:normal;text-align:end}
.zs-skill-toolbar{display:flex;align-items:center;flex-wrap:wrap;gap:10px;margin:16px 0}
.zs-skill-toolbar input{flex:1 1 220px;min-width:0}
.zs-skill-group{margin:12px 0}.zs-skill-group>summary{cursor:pointer;padding:8px 0;font-size:12px;color:var(--zw-muted)}
`;
 const ARCHITECTURE_CSS=`
html[data-ui-stronger]{--zw-paper:#fff;--zw-panel:#f6f6f6;--zw-ink:#222;--zw-muted:#797979;--zw-line:#e7e7e7;--zw-purple:#a79ab7;--zw-soft:#f0f0f0;--zw-deep:#525252}
html[data-ui-stronger] [data-ds-dark-theme],html[data-ui-stronger][data-ds-dark-theme]{--zw-paper:#171717;--zw-panel:#1d1d1d;--zw-ink:#e8e8e8;--zw-muted:#949494;--zw-line:#303030;--zw-purple:#b5a5c9;--zw-soft:#292929;--zw-deep:#c3c3c3}
html[data-ui-stronger] body{--dsw-radius-panel:8px;--dsw-radius-xl:8px;--dsw-radius-lg:6px;--dsw-radius-md:5px;--dsw-radius-sm:4px;--dsw-alias-button-primary-fill:var(--zw-ink)!important;--dsw-alias-button-primary-text:var(--zw-paper)!important;--dsw-alias-button-info-fill:var(--zw-ink);--dsw-alias-button-info-hover:var(--zw-muted);--dsw-alias-button-info-text:var(--zw-paper);--dsw-specific-selector:var(--zw-panel);--dsw-alias-bg-module:var(--zw-panel)}
html[data-ui-stronger] .mP3x-q_centerCol{border-radius:var(--zw-radius);background:var(--zw-paper)}.zs-native-icon{display:flex;align-items:center;justify-content:center;width:20px;height:20px}
.zs-sessions{display:flex;flex-direction:column;min-width:0;min-height:0;overflow:hidden}.zs-session-heading{display:flex;align-items:center;justify-content:space-between;padding:23px 15px 20px;gap:4px}.zs-session-heading>div{display:grid;gap:7px;min-width:0}.zs-session-heading small{font:7px ui-monospace,monospace;letter-spacing:1px;color:var(--zw-muted)}.zs-session-heading strong{font-size:16px;font-weight:550;letter-spacing:1px}.zs-icon-button{border:0;background:none;color:var(--zw-muted);padding:6px;width:30px;height:30px;display:grid;place-items:center;cursor:pointer;border-radius:var(--zw-radius);flex-shrink:0}.zs-icon-button svg{width:17px;height:17px}.zs-icon-button:hover{background:var(--zw-soft);color:var(--zw-ink)}
.zs-new{display:flex;align-items:center;gap:9px;margin:0 14px 20px;padding:10px 11px;background:var(--zw-ink);color:var(--zw-paper);border:1px solid var(--zw-ink);border-radius:var(--zw-radius);cursor:pointer;font-family:inherit;font-size:12px;font-weight:500;min-height:38px}.zs-new svg{width:16px;height:16px}.zs-new kbd{margin-left:auto;font:10px ui-monospace,monospace;opacity:.5}.zs-workspace-tree{flex:1;min-height:0;display:flex;flex-direction:column;overflow:hidden;padding:0 8px}.zs-workspace-tree>[data-slot]{min-height:0;flex:1;display:flex;flex-direction:column}.zs-sessions>footer{display:flex;gap:7px;align-items:center;padding:13px 17px;border-top:1px solid var(--zw-line);color:var(--zw-muted);font:7px ui-monospace,monospace;letter-spacing:1.5px}.zs-sessions>footer i{width:4px;height:4px;background:var(--zw-purple);transform:rotate(45deg)}
.zs-more{position:relative}.zs-more summary{list-style:none;cursor:pointer;display:grid;place-items:center;width:30px;height:24px;color:var(--zw-muted);font-size:18px}.zs-more-content{position:fixed;bottom:42px;left:59px;max-height:65vh;overflow:auto;background:var(--zw-paper);border:1px solid var(--zw-line);border-radius:var(--zw-radius);box-shadow:0 10px 30px #0002;min-width:180px;padding:10px;z-index:100;display:flex;flex-direction:column;gap:8px}.zs-more-content:empty:after{content:'暂无其他入口';color:var(--zw-muted);padding:8px}
html[data-ui-stronger] .an3WzG_root{--dsh-composer-side-clearance:24px;background:var(--zw-paper)}
html[data-ui-stronger] .an3WzG_body{--dsh-chat-content-width:var(--dsh-chat-user-width,min(760px,calc(100% - 64px)));--dsh-composer-card-max-width:800px;--dsh-composer-side-clearance:24px}
html[data-ui-stronger] .an3WzG_header{min-height:56px!important;padding:10px 28px 0;border-bottom:1px solid var(--zw-line);background:var(--zw-paper)}
html[data-ui-stronger] .an3WzG_headerBlank:after{content:none}.zs-header-label{display:flex;align-items:center;gap:10px;white-space:nowrap;font-size:11px;color:var(--zw-muted);margin-right:14px}.zs-header-label i{width:4px;height:4px;background:var(--zw-purple);transform:rotate(45deg)}.zs-header-label small{font:8px ui-monospace,monospace;letter-spacing:1.3px}
html[data-ui-stronger] .an3WzG_crumb{font-size:12px}.zw-controls{gap:5px}.zw-controls .zw-readiness{display:none}.zw-control{border:0!important;background:transparent!important;width:28px;height:28px;color:var(--zw-muted)!important}.zw-control:hover{color:var(--zw-ink)!important;background:var(--zw-panel)!important}.zw-control[aria-pressed=true]{color:var(--zw-ink)!important}.zw-live{background:var(--zw-purple)}
html[data-ui-stronger] .an3WzG_root[data-phase=hero] .an3WzG_scrollBody{justify-content:flex-start}
html[data-ui-stronger] .an3WzG_root[data-phase=hero] .an3WzG_composerSeat{flex:1;min-height:620px}
html[data-ui-stronger] .an3WzG_composerHero{width:min(850px,100%);flex:1;display:flex;flex-direction:column;gap:16px;padding:0 0 28px;align-self:center}
html[data-ui-stronger] .WOwLGG_root{flex:1;align-items:center;height:auto;padding:40px 28px 25px;min-height:300px}
html[data-ui-stronger] .WOwLGG_stack{max-width:100%;gap:0}.WOwLGG_stack:has(.zs-welcome) .WOwLGG_titleGroup{display:none!important}
html[data-ui-stronger] .WOwLGG_headline{display:block;padding:0;letter-spacing:0}.WOwLGG_headline:has(.zs-welcome) .WOwLGG_fishHitbox{display:block;width:100%;height:auto}.WOwLGG_stack:has(.zs-welcome) .WOwLGG_body{display:none}
.zs-welcome{width:100%;text-align:left}.zs-welcome-top{display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--zw-line);padding-bottom:17px;color:var(--zw-muted);font:8px ui-monospace,monospace;letter-spacing:1.6px;gap:10px}.zs-welcome-title{display:flex;align-items:center;justify-content:space-between;gap:20px;margin:32px 0 34px}.zs-welcome-title h1{font-size:34px;line-height:1.5;font-weight:450;letter-spacing:1px;margin:0 0 10px;color:var(--zw-ink)}.zs-welcome-title p{font-size:13px;font-weight:400;line-height:1.8;letter-spacing:.3px;color:var(--zw-muted);margin:0}.zs-emblem{width:100px;height:100px;position:relative;display:grid;place-items:center;flex-shrink:0}.zs-emblem .zw-mark{color:var(--zw-ink)}.zs-emblem i{position:absolute;inset:5px;border:1px solid var(--zw-line);transform:rotate(45deg)}.zs-emblem i:last-child{inset:21px;border-color:var(--zw-purple);opacity:.4}
.zs-launchers{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));border-top:1px solid var(--zw-line);border-bottom:1px solid var(--zw-line)}.zs-launchers button{display:flex;align-items:flex-start;text-align:left;min-width:0;gap:12px;border:0;border-right:1px solid var(--zw-line);border-radius:var(--zw-radius);padding:18px 13px;background:none;color:var(--zw-ink);cursor:pointer}.zs-launchers button:first-child{padding-left:0}.zs-launchers button:last-child{border-right:0}.zs-launchers button:hover{background:var(--zw-panel)}.zs-launchers small{font:8px ui-monospace,monospace;color:var(--zw-muted);padding-top:3px}.zs-launchers button>span{display:grid;gap:9px;min-width:0}.zs-launchers b{font-size:12px;font-weight:500}.zs-launchers em{font-size:10px;line-height:1.7;font-style:normal;font-weight:400;color:var(--zw-muted)}.zs-launchers svg{width:13px;height:13px;margin-left:auto;flex-shrink:0}
html[data-ui-stronger] .an3WzG_heroWorkspaceRow{padding:0 28px;margin:0;gap:8px}.an3WzG_heroWorkspaceRow .WOwLGG_workspace{font-size:11px}
html[data-ui-stronger] .an3WzG_composerStack:not(.an3WzG_composerHero){padding:12px 0 22px;gap:10px}
html[data-ui-stronger] .GRgSLq_card{border:1px solid var(--zw-line);background:var(--zw-paper);box-shadow:0 3px 12px #00000004;border-radius:var(--zw-radius);padding:12px 7px 3px;gap:15px}
html[data-ui-stronger] .GRgSLq_card:focus-within{border-color:var(--zw-muted);box-shadow:0 0 0 2px color-mix(in srgb,var(--zw-ink) 3%,transparent)}
html[data-ui-stronger] .GRgSLq_input{font-size:14px;line-height:26px;padding:4px 12px 0}html[data-ui-stronger] .GRgSLq_placeholder{font-size:14px;inset:4px 12px auto}html[data-ui-stronger] .GRgSLq_hero .GRgSLq_input{min-height:62px}
html[data-ui-stronger] .GRgSLq_row{border-top:1px solid var(--zw-line);padding:9px 4px 4px;margin:0 6px;gap:9px}html[data-ui-stronger] .GRgSLq_select{font-size:11px;font-weight:400}html[data-ui-stronger] .GRgSLq_primary{background:var(--zw-ink);color:var(--zw-paper);border-radius:var(--zw-radius);width:30px;height:30px}html[data-ui-stronger] .GRgSLq_add{background:none;border:0;border-radius:var(--zw-radius)}
html[data-ui-stronger] .LOmM4q_bubble{border:0;border-radius:var(--zw-radius);background:var(--zw-panel);padding:14px 18px;line-height:1.85}
.zw-frame{display:none}.zw-mark{color:var(--zw-ink)}
.zs-surface-backdrop{position:fixed;inset:var(--dsh-frame-chrome-top,0px) 0 0;z-index:1100;background:#0003;display:flex;justify-content:flex-end;color:var(--zw-ink)}.zs-tools{display:flex;flex-direction:column;width:min(470px,100%);background:var(--zw-paper);box-shadow:-12px 0 40px #0001;border-left:1px solid var(--zw-line);overflow:auto;min-height:0}.zs-surface-header{display:flex;justify-content:space-between;align-items:center;padding:27px 26px 22px;gap:15px}.zs-surface-header small{font:8px ui-monospace,monospace;color:var(--zw-muted);letter-spacing:1.3px}.zs-surface-header h2{font-size:21px;font-weight:500;letter-spacing:1px;margin:9px 0 0}.zs-tabs{display:flex;gap:22px;border-bottom:1px solid var(--zw-line);padding:0 26px}.zs-tabs button{position:relative;border:0;background:none;color:var(--zw-muted);font-size:12px;padding:13px 1px;cursor:pointer}.zs-tabs button[aria-pressed=true]{color:var(--zw-ink)}.zs-tabs button[aria-pressed=true]:after{content:'';position:absolute;bottom:-1px;height:2px;background:var(--zw-ink);left:0;right:0}.zs-tools .zw-panel{padding:8px 26px 30px;max-width:100%;margin:0}.zs-tools .zw-panel>header{display:none}.zs-tools .zw-setting{padding:20px 0}.zw-panel h2{font-size:23px;letter-spacing:1px;font-weight:500}.zw-panel .zw-mark{color:var(--zw-ink)}.zw-panel .zw-replay{margin:20px 0 10px}.zw-panel button[aria-checked=true]{background:var(--zw-ink);border-color:var(--zw-ink)}.zw-panel button[aria-checked=true]:before{background:var(--zw-paper)}.zw-connect input{border-radius:var(--zw-radius)}.zw-connect form{padding:0;background:none;border:0}.zw-connect summary{color:var(--zw-ink)}.zw-panel .zw-note{font-size:11px;line-height:1.9}
.zs-palette{width:min(570px,calc(100% - 32px));margin:14vh auto auto;background:var(--zw-paper);border:1px solid var(--zw-line);border-radius:var(--zw-radius);box-shadow:0 20px 80px #0003;overflow:hidden}.zs-palette header{display:flex;align-items:center;gap:13px;padding:18px;border-bottom:1px solid var(--zw-line)}.zs-palette header>svg{width:18px;height:18px;color:var(--zw-muted)}.zs-palette input{border:0;outline:none;background:none;flex:1;min-width:0;font-size:14px;color:var(--zw-ink)}.zs-palette header button{border:1px solid var(--zw-line);background:none;color:var(--zw-muted);font:10px ui-monospace,monospace;border-radius:var(--zw-radius);padding:3px 5px;cursor:pointer}.zs-command-results{display:grid;gap:4px;padding:8px;max-height:45vh;overflow:auto}.zs-command-results button{display:flex;align-items:center;gap:12px;border:0;text-align:left;background:none;color:var(--zw-ink);border-radius:var(--zw-radius);cursor:pointer;padding:13px;font-size:12px}.zs-command-results button[aria-selected=true],.zs-command-results button:hover{background:var(--zw-soft)}.zs-command-results small{margin-left:auto;color:var(--zw-muted);font-size:10px}.zs-command-results svg{width:13px;height:13px;color:var(--zw-muted)}.zs-command-results p{color:var(--zw-muted);font-size:12px;padding:10px}.zs-palette footer{display:flex;justify-content:space-between;gap:10px;padding:13px 18px;border-top:1px solid var(--zw-line);font:9px ui-monospace,monospace;color:var(--zw-muted)}
html[data-ui-stronger] .AnXs9G_panel{border:1px solid var(--zw-line);border-radius:var(--zw-radius);background:var(--zw-paper);box-shadow:0 20px 80px #0002;overflow:hidden;width:min(1050px,calc(100vw - 80px));height:min(780px,calc(100vh - 70px))}
html[data-ui-stronger] .AnXs9G_nav{background:var(--zw-panel);border-right:1px solid var(--zw-line)}html[data-ui-stronger] .AnXs9G_navList{padding:16px 12px;gap:3px}html[data-ui-stronger] .AnXs9G_navCell{font-size:12px;border-radius:var(--zw-radius);min-height:36px}html[data-ui-stronger] .AnXs9G_content{min-width:0;background:var(--zw-paper)}html[data-ui-stronger] .AnXs9G_header{background:var(--zw-paper);border-bottom:1px solid var(--zw-line);min-height:50px}html[data-ui-stronger] .AnXs9G_options{padding:0 28px 30px}
html[data-ui-stronger] .V7pFBG_pageTitle{font-size:27px;font-weight:450;letter-spacing:1px}html[data-ui-stronger] .V7pFBG_pageIntro{font-size:12px;color:var(--zw-muted)}html[data-ui-stronger] .V7pFBG_cards{display:flex;flex-direction:column;gap:0;border:1px solid var(--zw-line);border-radius:var(--zw-radius);overflow:hidden}html[data-ui-stronger] .V7pFBG_card{border:0;border-bottom:1px solid var(--zw-line);border-radius:var(--zw-radius);background:var(--zw-paper);padding:12px 18px;margin:0;min-width:0;box-shadow:none}html[data-ui-stronger] .V7pFBG_card:last-child{border:0}html[data-ui-stronger] .V7pFBG_cardHead{gap:16px;align-items:center;padding:0;min-height:44px}html[data-ui-stronger] .V7pFBG_cardIcon{width:30px;height:30px;min-width:30px;filter:grayscale(1);background:none;border:0;border-radius:var(--zw-radius)}html[data-ui-stronger] .V7pFBG_cardTitle{font-size:13px;font-weight:500}html[data-ui-stronger] .V7pFBG_cardDesc{font-size:11px;line-height:1.7;color:var(--zw-muted)}html[data-ui-stronger] .V7pFBG_group{margin-top:25px}html[data-ui-stronger] .V7pFBG_group h3{font-size:11px;color:var(--zw-muted);font-weight:500;letter-spacing:.5px;padding-bottom:10px}html[data-ui-stronger] .V7pFBG_cardLink:hover{background:var(--zw-panel)}
[data-ui-stronger-motion] .zs-tools{animation:zs-drawer .28s cubic-bezier(.2,.8,.2,1) both}[data-ui-stronger-motion] .zs-palette{animation:zw-arrive .18s ease-out both}[data-ui-stronger-motion] .zs-welcome-title{animation:zw-arrive .4s ease-out both}[data-ui-stronger-motion] .zs-emblem{animation:zw-breathe 7s ease-in-out infinite}@keyframes zs-drawer{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:none}}
@media(max-width:750px){.zs-welcome-title h1{font-size:27px}.zs-emblem{width:72px;height:72px}.zs-emblem .zw-mark{width:38px;height:44px}.zs-launchers{grid-template-columns:1fr}.zs-launchers button{padding:12px 0;border-right:0;border-bottom:1px solid var(--zw-line);align-items:center}.zs-launchers button:last-child{border-bottom:0}.zs-launchers button>span{display:flex;align-items:center;gap:12px;flex-wrap:wrap}.zs-launchers em{font-size:10px}.zs-welcome-top>span:last-child{display:none}html[data-ui-stronger] .WOwLGG_root{padding:25px 24px}html[data-ui-stronger] .an3WzG_root[data-phase=hero] .an3WzG_composerSeat{min-height:580px}html[data-ui-stronger] .an3WzG_header{padding-left:20px;padding-right:20px}.zs-header-label small{display:none}}
@media(max-width:650px){html[data-ui-stronger] .AnXs9G_panel{flex-direction:column;width:calc(100vw - 24px);height:calc(100vh - 24px);max-height:calc(100vh - 24px)}html[data-ui-stronger] .AnXs9G_nav{width:100%;flex:none;border-right:0;border-bottom:1px solid var(--zw-line)}html[data-ui-stronger] .AnXs9G_navList{display:flex;flex-direction:row;overflow-x:auto;padding:5px 10px}html[data-ui-stronger] .AnXs9G_navCell{min-width:max-content;white-space:nowrap;padding:8px}html[data-ui-stronger] .AnXs9G_content{min-height:0;flex:1}html[data-ui-stronger] .AnXs9G_options{padding:0 12px 18px}.zw-panel{padding:20px 4px}.zs-new kbd{display:none}.zs-welcome-title{margin:25px 0}.zs-palette{margin-top:9vh}}
@media(prefers-reduced-motion:reduce){.zs-tools,.zs-palette,.zs-welcome-title,.zs-emblem{animation:none!important;transition:none!important}}
 @keyframes zw-copy{from{opacity:.75;transform:translateY(4px)}to{opacity:1;transform:none}}
 @media(max-width:760px){html[data-ui-stronger] .an3WzG_root{--dsh-composer-side-clearance:16px}html[data-ui-stronger] .an3WzG_header{padding:0 15px}html[data-ui-stronger] .WOwLGG_titleGroup{font-size:21px;letter-spacing:3px}.zw-hero-mark{height:126px}.zw-dial{width:124px;height:124px}.zw-controls .zw-readiness{display:none}}
 @media(max-height:620px){html[data-ui-stronger] .an3WzG_composerHero{gap:10px;padding-top:12px}.zw-hero-mark{height:100px}.zw-dial{width:100px;height:100px}html[data-ui-stronger] .WOwLGG_headline{gap:12px}}

.zs-team-header h2{margin:0 0 8px;font-size:16px;font-weight:500}
.zs-team-policy{padding:16px 0;border-block:1px solid var(--zs-line,#dddde2);margin:4px 0 20px}
.zs-team-toggle{display:flex;align-items:center;gap:10px;margin-bottom:8px}
.zs-team-toggle input{flex:0 0 auto;margin:0;width:16px;height:16px}
.zs-team-limits{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:16px 0 10px}
.zs-team-limits label{display:flex;flex-direction:column;gap:6px;min-width:0}
.zs-team-limits select{min-height:34px}
.zs-team-policy small,.zs-team-task>small{display:block;line-height:1.65;color:var(--zs-muted,#72727e)}
.zs-team-board>header,.zs-team-task-head{display:flex;align-items:baseline;justify-content:space-between;gap:12px;flex-wrap:wrap}
.zs-team-board>header>small,.zs-team-task-head>small{display:block;color:var(--zs-muted,#72727e)}
.zs-team-task{padding:14px 0;border-bottom:1px solid var(--zs-line,#dddde2);overflow-wrap:anywhere}
.zs-team-task p{margin:8px 0;line-height:1.65}
html[data-ui-stronger] .zw-controls{flex:0 0 auto}
html[data-ui-stronger] .zw-controls .zs-process-trigger{flex:0 0 auto;white-space:nowrap;min-width:40px}
.zs-team-entry{flex-shrink:0;font:inherit;font-size:11px;padding:4px 8px;white-space:nowrap;color:inherit;background:transparent;border:1px solid transparent;border-radius:4px}
.zs-team-entry:hover{border-color:var(--zs-line,#dddde2);background:rgba(146,127,171,.06)}
`;
 function Mark({size=34,className=''}){
  return h('svg',{width:size,height:size,className:'zw-mark '+className,viewBox:'0 0 64 64','aria-hidden':true},
   h('path',{d:'M14 19 32 7V32L14 45Z',fill:'currentColor'}),
   h('path',{d:'M32 7 50 19 32 32Z',fill:'currentColor',opacity:.32}),
   h('path',{d:'M50 19V45L32 57V32Z',fill:'var(--zw-purple,#b7a8ca)',opacity:.8}),
   h('path',{d:'M14 45 32 32V57Z',fill:'var(--zw-paper,#fafafa)'}),
   h('path',{d:'M32 7 50 19V45L32 57 14 45V19Z M32 7V32L50 19 M32 32V57',fill:'none',stroke:'currentColor',strokeWidth:1.5,strokeLinejoin:'miter',opacity:.6}));
 }

 function Glyph({kind}){return h('svg',{viewBox:'0 0 24 24','aria-hidden':true},kind==='voice'?h('path',{d:'M4 9h4l5-4v14l-5-4H4z M17 8c3 2 3 6 0 8'}):kind==='play'?h('path',{d:'m9 5 11 7-11 7V5Z'}):kind==='pet'?h('path',{d:'m12 3 7 8-7 10-7-10z M5 11h14 M12 3v18'}):h('path',{d:'M6 12h12 M12 6v12'}));}
 function createStore(control){
  let state={version:'0.16.0',edition:'public',preferences:{enabled:true,motion:true,startup:true,voice:false,pet:false},capabilities:{voice:false,pet:false},loaded:false,error:''};const listeners=new Set();let disposed=false,generation=0,refreshing;
  function commit(v){if(disposed)return;state={...state,...v};listeners.forEach(f=>f());const root=document.documentElement;root.toggleAttribute('data-ui-stronger',state.preferences.enabled);root.toggleAttribute('data-ui-stronger-motion',state.preferences.enabled&&state.preferences.motion);}
  function setLooseFolder(value){
   generation++;
   commit({workbench:{...state.workbench,looseFolder:value}});
  }
  return {setLooseFolder,removeSession:id=>{generation++;commit({deletedSessions:[...new Set([...(state.deletedSessions??[]),id])]});},subscribe:f=>{listeners.add(f);return ()=>listeners.delete(f);},snapshot:()=>state,session:id=>{if(state.sessionId!==id)commit({sessionId:id});},refresh(){if(disposed)return Promise.resolve();if(refreshing)return refreshing;const token=generation;refreshing=(async()=>{try{const value=await control('status');if(token===generation)commit({...value,loaded:true,error:''});}catch(e){if(token===generation)commit({loaded:true,error:e.message});}finally{refreshing=undefined;}})();return refreshing;},async update(p){const token=++generation;try{const value=await control('preferences',p);if(token===generation)commit({...value,error:''});}catch(e){if(token===generation)commit({error:e.message});}},error:e=>commit({error:e}),dispose(){disposed=true;generation++;listeners.clear();document.documentElement.removeAttribute('data-ui-stronger');document.documentElement.removeAttribute('data-ui-stronger-motion');}};
 }
 function useState(store){return React.useSyncExternalStore(store.subscribe,store.snapshot,store.snapshot);}
 function Connections({store,control,tab}){
  const [fields,setFields]=React.useState(null),[saving,setSaving]=React.useState(false),[message,setMessage]=React.useState('');
  React.useEffect(()=>{let alive=true;const c=new AbortController();control('connections',{},c.signal).then(v=>{if(alive)setFields(v);}).catch(e=>{if(alive)setMessage(e.message);});return ()=>{alive=false;c.abort();};},[control]);
  async function save(e){e.preventDefault();setSaving(true);setMessage('');try{await control('configure',fields);await store.refresh();setMessage('已保存到本机。素材和模型不会随插件发布。');}catch(error){setMessage(error.message);}finally{setSaving(false);}}
  return h('details',{className:'zw-connect',open:tab==='voice'||tab==='pet'?true:undefined},h('summary',null,'接入语音模型 / 桌宠素材'),h('p',null,'模型服务由你本机运行。这里只保存连接和素材路径，不复制或上传模型。'),fields?h('form',{onSubmit:save},... [['api','GPT-SoVITS 本机接口','http://127.0.0.1:9880'],['reference','参考音频路径','本机音频文件的绝对路径'],['transcript','参考音频对应文字','与音频一致的文字'],['skin','桌宠形象路径','本机 PNG / WebP / JPG 文件的绝对路径']].filter(([key])=>!tab||tab==='all'||(tab==='pet'?key==='skin':key!=='skin')).map(([key,label,placeholder])=>h('label',{key},h('span',null,label),h('input',{value:fields[key],placeholder,onChange:e=>setFields({...fields,[key]:e.target.value}),autoComplete:'off',spellCheck:false}))),h('button',{type:'submit',disabled:saving},saving?'保存中…':'保存本机接入')):null,h('p',{'aria-live':'polite'},message));
 }
 function Settings({store,control,tab='all'}){
  const s=useState(store),rows=[['enabled','界面强化','配色、布局、聊天与输入区域'],['motion','自然动效','轻微呼吸、控件回应与新消息过渡'],['startup','启动加载画面','应用加载时显示，就绪后自动退出'],['voice','本地语音',s.capabilities.voice?'当前会话回复在本机合成':'请在下方接入本机模型服务与参考音频'],['pet','桌宠形象',s.capabilities.pet?'可拖动的本机角色形象':'请在下方选择你自己的形象文件']];
  return h('section',{className:'zw-panel'},h('header',null,h(Mark,{size:54}),h('div',null,h('small',null,'INTERFACE / MOTION'),h('h2',null,'界面增强'),h('p',null,'DSH 驱动 · 可随时停用恢复'))),...rows.filter(([key])=>tab==='all'||(tab==='interface'?['enabled','motion','startup'].includes(key):key===tab)).map(([key,label,detail])=>h('div',{key,className:'zw-setting'},h('div',null,h('strong',null,label),h('span',null,detail)),h('button',{type:'button',role:'switch','aria-label':label,'aria-checked':s.preferences[key],disabled:(key==='voice'||key==='pet')&&!s.capabilities[key],onClick:()=>store.update({[key]:!s.preferences[key]})}))),(tab==='all'||tab==='voice'||tab==='pet')?h(Connections,{store,control,tab}):null,h('p',{className:'zw-note'},'模型、订阅、插件、设置、会话与技能均由 DSH 管理。接入信息只保存在本机。'),h('p',{className:'zw-error',role:'alert'},s.error));
 }
 function Header({store,control,sessionId,useSession}){React.useEffect(()=>{store.session(sessionId);},[sessionId,store]);
  const s=useState(store),busy=useSession?useSession(x=>x?.running??false):false;
  const [activity,setActivity]=React.useState({revision:0,hasAnswer:false}),[error,setError]=React.useState(''),[speaking,setSpeaking]=React.useState(false),[playing,setPlaying]=React.useState(false);
  const seen=React.useRef(null),audio=React.useRef(null),request=React.useRef(null);
  const play=React.useCallback(async revision=>{
   if(speaking)return;setSpeaking(true);setError('');request.current?.abort();const controller=new AbortController();request.current=controller;
   try{
    let offset=0;
    while(offset!==null){
     const data=await control('speak',{sessionId,revision,offset},controller.signal);controller.signal.throwIfAborted();
     if(data.wav){
      const bytes=Uint8Array.from(atob(data.wav),c=>c.charCodeAt(0));const url=URL.createObjectURL(new Blob([bytes],{type:'audio/wav'}));const player=new Audio(url);audio.current?.pause();audio.current=player;player.onplaying=()=>setPlaying(true);
      try{await new Promise((resolve,reject)=>{const abort=()=>{player.pause();reject(new Error('已停止朗读'));};controller.signal.addEventListener('abort',abort,{once:true});const finish=()=>{controller.signal.removeEventListener('abort',abort);resolve();};player.onended=finish;player.onerror=()=>{controller.signal.removeEventListener('abort',abort);reject(new Error('音频播放失败'));};player.play().catch(()=>{controller.signal.removeEventListener('abort',abort);reject(new Error('点击朗读按钮播放；浏览器阻止了自动播放。'));});});}finally{setPlaying(false);URL.revokeObjectURL(url);}
     }
     if(data.nextOffset!==null&&(!Number.isSafeInteger(data.nextOffset)||data.nextOffset<=offset))throw new Error('无效语音分段');offset=data.nextOffset;
    }
   }catch(e){if(!controller.signal.aborted)setError(e.message);}finally{if(!controller.signal.aborted)setSpeaking(false);}
  },[sessionId,speaking,control]);
  React.useEffect(()=>{let active=true;const c=new AbortController();seen.current=null;
   const poll=async()=>{if(document.hidden||!s.preferences.enabled)return;try{const v=await control('activity',{sessionId,after:seen.current??0},c.signal);if(!active)return;setActivity(v);window.dispatchEvent(new CustomEvent('ui-stronger-presence',{detail:{busy:v.busy,speaking:false}}));if(seen.current===null)seen.current=v.revision;else if(!v.busy&&v.hasAnswer&&v.revision>seen.current){seen.current=v.revision;if(s.preferences.voice)void play(v.revision);}}catch(e){if(active&&!c.signal.aborted)setError(e.message);}};
   if(s.edition==='full'&&(s.preferences.voice||s.preferences.pet)){void poll();const t=setInterval(poll,1500);return ()=>{active=false;c.abort();clearInterval(t);};}return ()=>{active=false;c.abort();};
  },[control,sessionId,s.edition,s.preferences.voice,s.preferences.pet,s.preferences.enabled]);
  React.useEffect(()=>{window.dispatchEvent(new CustomEvent('ui-stronger-presence',{detail:{busy,speaking:playing}}));},[busy,playing]);
  React.useEffect(()=>{if(!s.preferences.enabled||!s.preferences.voice){request.current?.abort();audio.current?.pause();setPlaying(false);setSpeaking(false);}},[s.preferences.enabled,s.preferences.voice]);
  React.useEffect(()=>()=>{request.current?.abort();if(audio.current){audio.current.pause();if(audio.current.src)URL.revokeObjectURL(audio.current.src);}},[sessionId]);
  if(!s.preferences.enabled)return null;
  return h('div',{className:'zw-controls'},h('button',{className:'zw-control',title:'当前会话定时任务',onClick:()=>openTools('schedule')},'定时'),h('button',{className:'zw-control zs-process-trigger',title:'查看本次过程',onClick:()=>openTools('process'),'aria-label':'查看本次过程'},'过程'),s.preferences.voice&&s.capabilities.voice?h(React.Fragment,null,h('button',{className:'zw-control',title:s.preferences.voice?'关闭本地语音':'开启本地语音','aria-label':'本地语音',disabled:!s.capabilities.voice,'aria-pressed':s.preferences.voice,onClick:()=>{if(s.preferences.voice){request.current?.abort();audio.current?.pause();setPlaying(false);setSpeaking(false);}void store.update({voice:!s.preferences.voice});}},h(Glyph,{kind:'voice'})),s.preferences.voice&&activity.hasAnswer?h('button',{className:'zw-control',disabled:speaking,title:speaking?'正在合成与播放':'朗读最近回复','aria-label':'朗读最近回复',onClick:()=>play(activity.revision)},speaking?'…':h(Glyph,{kind:'play'})):null):null,error?h('span',{className:'zw-error',role:'alert'},error):null);
 }
 function Pet({store,control}){const s=useState(store),[asset,setAsset]=React.useState(null),[presence,setPresence]=React.useState({busy:false}),[offset,setOffset]=React.useState({x:0,y:0}),drag=React.useRef(null);
  React.useEffect(()=>{if(!s.preferences.enabled||!s.preferences.pet||s.edition!=='full'){setAsset(null);return;}let alive=true;const c=new AbortController();control('asset',{},c.signal).then(v=>{if(alive)setAsset(v?.image??null);}).catch(e=>{if(alive)store.error(e.message);});return ()=>{alive=false;c.abort();};},[s.preferences.enabled,s.preferences.pet,s.edition,s.connectionsRevision,control]);
  React.useEffect(()=>{const listener=e=>setPresence(e.detail);window.addEventListener('ui-stronger-presence',listener);return ()=>window.removeEventListener('ui-stronger-presence',listener);},[]);
  if(!asset)return null;return h('div',{className:'zw-pet','data-busy':presence.busy||presence.speaking,style:{transform:`translate(${offset.x}px,${offset.y}px)`},'aria-label':'本机桌宠形象',onPointerDown:e=>{if(e.target.tagName==='BUTTON')return;drag.current={x:e.clientX-offset.x,y:e.clientY-offset.y};e.currentTarget.setPointerCapture(e.pointerId);},onPointerMove:e=>{if(!drag.current)return;setOffset({x:Math.max(-window.innerWidth+160,Math.min(0,e.clientX-drag.current.x)),y:Math.max(-window.innerHeight+200,Math.min(0,e.clientY-drag.current.y))});},onPointerUp:()=>{drag.current=null;},onPointerCancel:()=>{drag.current=null;}},h('button',{title:'收起桌宠','aria-label':'收起桌宠',onClick:()=>store.update({pet:false})},'×'),h('img',{src:asset,alt:'',draggable:false}),h('small',null,presence.speaking?'SPEAKING':presence.busy?'THINKING':'COMPANION / LOCAL'));
 }
 const openTools=(tab='')=>window.dispatchEvent(new CustomEvent('ui-stronger-tools',{detail:tab}));
 const openPalette=()=>window.dispatchEvent(new CustomEvent('ui-stronger-palette'));
 function NavIcon({kind}){const paths={chat:'M6 4h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 3V6a2 2 0 0 1 2-2Z',plus:'M12 5v14M5 12h14',panel:'M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2ZM9 4v16',search:'M16 16l4 4M18 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0',grid:'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',tools:'M4 4h6v6H4zM17 3l4 4-4 4-4-4ZM4 14h6v6H4zM14 14h6v6h-6z',arrow:'M5 12h14M14 7l5 5-5 5',close:'m6 6 12 12M6 18 18 6'};return h('svg',{viewBox:'0 0 24 24','aria-hidden':true,fill:'none',stroke:'currentColor',strokeWidth:1.4,strokeLinecap:'round',strokeLinejoin:'round'},h('path',{d:paths[kind]||paths.grid}));}
 function useCatalog(navigation){return React.useSyncExternalStore(navigation.subscribe,navigation.snapshot,navigation.snapshot);}
 function isDefaultShortcut(r){return (r.id==='plugins'&&r.kind==='panel'&&r.target==='plugins'&&r.title==='插件')||(r.id==='extensions'&&r.kind==='extension'&&r.target==='interface'&&r.title==='界面与扩展')||(r.id==='context'&&r.kind==='extension'&&r.target==='context'&&r.title==='上下文与模型');}
 function uniqueCommands(rows){const seen=new Set();return rows.filter(row=>{if(seen.has(row.id))return false;seen.add(row.id);return true;});}
 function Welcome({navigation,store}){const panels=useCatalog(navigation),state=useState(store),modules=(state.workbench?.modules??[]).filter(r=>!isDefaultShortcut(r));return h('section',{className:'zs-welcome zs-quiet-home','aria-label':'开始工作'},h('div',{className:'hud-register','aria-hidden':true},h('span',null,'DSH / WORKSPACE'),h('span',null,'INTERFACE 01')),h(Mark,{size:34}),h('h1',null,'等待你的指令'),h('p',{className:'zs-start-hint'},'描述任务，或输入 / 调用技能。'),modules.some(r=>r.visible)?h('details',{className:'zs-home-modules'},h('summary',null,'工作模块'),h('div',{className:'zs-launchers'},...modules.filter(r=>r.visible).map(r=>h('button',{key:r.id,disabled:r.kind==='panel'&&!panels.some(p=>p.id===r.target),onClick:()=>r.kind==='panel'?navigation.select(r.target):r.kind==='extension'?openTools(r.target):navigation.prefill(r.target)},h('span',null,r.title),h(NavIcon,{kind:'arrow'})))),h('button',{className:'zs-work-edit',onClick:()=>openTools('modules')},'编辑模块')):null,h('div',{className:'hud-register hud-register-bottom','aria-hidden':true},h('span',null,h('i'),state.version?'REV '+state.version:'DSH INTERFACE'),h('span',null,'/ COMMAND ENTRY')));}
 function focusableIn(root){return [...root.querySelectorAll('button,input,textarea,select,summary,a[href],[tabindex]')].filter(x=>{if(x.matches(':disabled,[aria-disabled="true"],[tabindex="-1"]')||x.closest('[hidden],[inert],[aria-hidden="true"]')||!x.getClientRects().length)return false;for(let p=x.parentElement;p&&p!==root;p=p.parentElement)if(p.tagName==='DETAILS'&&!p.open&&!p.querySelector('summary')?.contains(x))return false;return true;});}
 function manageDialogFocus(root,onClose){
  const previous=document.activeElement,top=()=>[...document.querySelectorAll('[role="dialog"][aria-modal="true"]')].filter(x=>x.getClientRects().length).at(-1);
  (focusableIn(root)[0]??root).focus();
  const key=e=>{if(e.defaultPrevented||top()!==root)return;if(e.key==='Escape'){e.preventDefault();e.stopPropagation();onClose();return;}if(e.key!=='Tab')return;const nodes=focusableIn(root),first=nodes[0],last=nodes.at(-1);if(!first){e.preventDefault();root.focus();return;}if(!root.contains(document.activeElement)){e.preventDefault();(e.shiftKey?last:first).focus();}else if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}};
  const pickerKey=e=>{if(e.key==='Escape'&&top()===root&&root.contains(e.target)&&e.target?.closest?.('select')?.matches(':open'))e.stopPropagation();};
  window.addEventListener('keydown',pickerKey,true);window.addEventListener('keydown',key);return ()=>{window.removeEventListener('keydown',pickerKey,true);window.removeEventListener('keydown',key);const active=top();if(previous?.isConnected&&!previous.matches?.(':disabled,[aria-disabled="true"]')&&(!active||active===root||active.contains(previous)))previous.focus({preventScroll:true});};
 }
 function FocusSurface({children,label,onClose,className,canClose=true}){
  const ref=React.useRef(null),close=React.useRef(onClose),timer=React.useRef(null),[leaving,setLeaving]=React.useState(false);close.current=onClose;
  const closable=React.useRef(canClose);closable.current=canClose;const dismiss=()=>{if(!closable.current||timer.current)return;const root=document.documentElement;if(!root.hasAttribute('data-ui-stronger-motion')||window.matchMedia?.('(prefers-reduced-motion: reduce)').matches){close.current();return;}setLeaving(true);timer.current=setTimeout(()=>{timer.current=null;close.current();},185);};
  React.useEffect(()=>{const off=manageDialogFocus(ref.current,dismiss);return ()=>{clearTimeout(timer.current);off();};},[]);
  return ReactDOM.createPortal(h('div',{className:'zs-surface-backdrop','data-leaving':leaving?'':undefined,onClickCapture:e=>{if(e.target.closest?.('[data-surface-close]')){e.preventDefault();dismiss();}},onPointerDown:e=>{if(e.target===e.currentTarget)dismiss();}},h('section',{ref,role:'dialog','aria-modal':true,'aria-label':label,tabIndex:-1,className},children)),document.body);
 }
 const THINK_ACTIONS=[['listen','倾听'],['repeat','复述确认'],['decompose','拆解'],['probe','追问'],['externalize','举例与图解'],['explain','解释'],['compare','比较'],['challenge','检查反例'],['summarize','总结'],['action','下一步']];
 function ThinkingPanel({store,control,navigation,onDirty}){
  const state=useState(store),[boards,setBoards]=React.useState([]),[board,setBoard]=React.useState(null),[draft,setDraft]=React.useState(null),[busy,setBusy]=React.useState(false),[error,setError]=React.useState(''),[notice,setNotice]=React.useState(''),[action,setAction]=React.useState('decompose'),[entry,setEntry]=React.useState({collection:'notes',title:'',text:''}),[graph,setGraph]=React.useState('');
  const alive=React.useRef(true),flight=React.useRef(false),dirty=board&&draft&&['title','scene','summary','points','question'].some(k=>board[k]!==draft[k]);
  React.useEffect(()=>{onDirty?.(!!dirty);return ()=>onDirty?.(false);},[!!dirty]);
  const adopt=b=>{setBoard(b);setDraft({title:b.title,scene:b.scene,summary:b.summary,points:b.points,question:b.question});setGraph(JSON.stringify(b.graph,null,2));};
  const refresh=async()=>{const v=await control('thinking',{op:'list'});if(alive.current)setBoards(v.boards);return v;};
  const run=async(op,args={},revision=true)=>{if(flight.current)return;flight.current=true;setBusy(true);setError('');setNotice('');try{const value=await control('thinking',{op,...revision?{id:board.id,revision:board.revision}:{},...args});if(!alive.current)return;if(value?.notes)adopt(value);await refresh();return value;}catch(e){if(alive.current)setError(e.message);}finally{flight.current=false;if(alive.current)setBusy(false);}};
  React.useEffect(()=>{alive.current=true;void refresh().catch(e=>{if(alive.current)setError(e.message);});return ()=>{alive.current=false;};},[]);
  const load=id=>{if(!id){setBoard(null);setDraft(null);return;}void run('get',{id},false);};
  const download=async()=>{const data=await run('backup',{},false);if(!data)return;const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'})),link=document.createElement('a');link.href=url;link.download='thinking-backup.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
  const importFile=async file=>{if(!file)return;if(file.size>2_000_000){setError('导入最多 2 MB');return;}try{const document=JSON.parse(await file.text()),result=await run('import',{document},false);if(result?.ids?.[0])load(result.ids[0]);}catch(e){setError(e.message);}};
  const locked=busy||!!dirty;
  return h('section',{className:'zs-thinking'},h('p',{className:'zs-subtle'},'把想法变成你能理解、纠正和继续推进的结构。'),h('div',{className:'zw-row-actions'},h('select',{'aria-label':'选择思考',value:board?.id??'',disabled:locked,onChange:e=>load(e.target.value)},h('option',{value:''},'选择一个思考…'),...boards.map(b=>h('option',{key:b.id,value:b.id},b.title))),h('button',{disabled:locked,onClick:()=>run('create',{title:'新的思考'},false)},'新建')),
   board&&draft?h(React.Fragment,null,h('form',{className:'zs-thinking-understanding',onSubmit:e=>{e.preventDefault();void run('update',{patch:draft});}},h('label',null,'主题',h('input',{required:true,maxLength:100,value:draft.title,disabled:busy,onChange:e=>setDraft({...draft,title:e.target.value})})),h('label',null,'场景',h('select',{value:draft.scene,disabled:busy,onChange:e=>setDraft({...draft,scene:e.target.value})},...Object.entries({general:'自由探索',learning:'学习',writing:'写作',research:'研究',decision:'选择与反思',project:'项目'}).map(([k,v])=>h('option',{key:k,value:k},v)))),...['summary','points','question'].map((key,i)=>h('label',{key},['当前理解','关键要点','还没想清的问题'][i],h('textarea',{rows:i===0?4:2,maxLength:6000,value:draft[key],disabled:busy,onChange:e=>setDraft({...draft,[key]:e.target.value})}))),h('div',{className:'zw-row-actions'},h('button',{type:'submit',disabled:busy||!dirty},busy?'保存中…':'保存理解'),dirty?h('button',{type:'button',disabled:busy,onClick:()=>adopt(board)},'放弃修改'):null,dirty?h('small',null,'保存后可继续切换和整理。'):null)),
    h('div',{className:'zw-row-actions'},h('select',{'aria-label':'思考方式',value:action,disabled:locked,onChange:e=>setAction(e.target.value)},...THINK_ACTIONS.map(([k,v])=>h('option',{key:k,value:k},v))),h('button',{disabled:locked,onClick:async()=>{const value=await run('prompt',{action,query:board.question||board.title});if(value){navigation.prefill(value.prompt);window.dispatchEvent(new CustomEvent('ui-stronger-dismiss'));}}},'放入对话')),
    h('details',null,h('summary',null,'笔记、材料与手动记忆'),h('p',{className:'zs-subtle'},'只将勾选的记忆与命中的材料片段放入生成的提示词。模型不自动读取其他思考。'),h('form',{onSubmit:async e=>{e.preventDefault();const v=await run('add',entry);if(v)setEntry({...entry,title:'',text:''});}},h('select',{'aria-label':'条目类型',value:entry.collection,disabled:locked,onChange:e=>setEntry({...entry,collection:e.target.value})},h('option',{value:'notes'},'笔记'),h('option',{value:'materials'},'材料'),h('option',{value:'memories'},'手动记忆')),h('input',{'aria-label':'条目标题',required:true,maxLength:100,value:entry.title,disabled:locked,onChange:e=>setEntry({...entry,title:e.target.value}),placeholder:'标题'}),h('textarea',{'aria-label':'条目内容',rows:4,required:true,maxLength:entry.collection==='materials'?100000:12000,value:entry.text,disabled:locked,onChange:e=>setEntry({...entry,text:e.target.value}),placeholder:'粘贴内容'}),h('button',{disabled:locked},'添加到本机')),...['notes','materials','memories'].map(collection=>h('div',{key:collection,className:'zw-entries'},...board[collection].map(item=>h('article',{key:item.id},h('div',null,h('b',null,item.title),h('details',null,h('summary',null,'查看与编辑'),h('form',{onSubmit:e=>{e.preventDefault();void run('edit',{collection,itemId:item.id,text:new FormData(e.currentTarget).get('text')});}},h('textarea',{key:item.updated,name:'text','aria-label':'编辑 '+item.title,rows:4,defaultValue:item.text,maxLength:collection==='materials'?100000:12000,disabled:locked}),h('button',{disabled:locked},'保存修改')))),collection!=='notes'?h('label',null,h('input',{type:'checkbox',checked:!!item.selected,disabled:locked,onChange:e=>run('edit',{collection,itemId:item.id,selected:e.target.checked})}),' 选用'):null))))),
    h('details',null,h('summary',null,'概念关系'),h('p',{className:'zs-subtle'},'概念图是可修改的表达草图，关系不代表已证明的因果。'),h('div',{className:'zs-concepts'},...board.graph.nodes.map(n=>h('span',{key:n.id},n.text))),h('ul',null,...board.graph.edges.map((edge,i)=>h('li',{key:i},(board.graph.nodes.find(n=>n.id===edge.from)?.text??edge.from)+' → '+(board.graph.nodes.find(n=>n.id===edge.to)?.text??edge.to)+(edge.label?' · '+edge.label:'')))),h('details',null,h('summary',null,'编辑概念与关系'),h('textarea',{'aria-label':'概念关系 JSON',rows:8,value:graph,disabled:locked,onChange:e=>setGraph(e.target.value)}),h('button',{disabled:locked,onClick:()=>{try{void run('update',{patch:{graph:JSON.parse(graph)}});}catch(e){setError('概念 JSON 格式有误：'+e.message);}}},'保存概念'))),
    h('details',null,h('summary',null,'模型访问与待确认建议'+(board.proposals.length?' · '+board.proposals.length:'')),h('p',{className:'zs-subtle'},'仅授权关联的当前会话读取选用内容并提出笔记，不允许模型覆盖工作理解。'),h('label',null,h('input',{type:'checkbox',checked:board.aiAccess&&board.sessionId===state.sessionId,disabled:locked||!state.sessionId,onChange:e=>run('update',{patch:{aiAccess:e.target.checked,sessionId:e.target.checked?state.sessionId:''}})}),' 允许当前对话访问'),h('small',null,'工作台编号：'+board.id),h('button',{disabled:locked,onClick:()=>run('get',{id:board.id},false)},'刷新建议'),...board.proposals.map(p=>h('article',{key:p.id},h('b',null,p.title),h('p',null,p.text),h('div',{className:'zw-row-actions'},h('button',{disabled:locked,onClick:()=>run('review',{proposalId:p.id,accept:true})},'采纳到笔记'),h('button',{disabled:locked,onClick:()=>run('review',{proposalId:p.id,accept:false})},'忽略')))))):h('p',{className:'zw-empty'},'新建思考，或导入 Curio 单问题 JSON。对话、模型与插件继续由 DSH 管理。'),
   h('details',null,h('summary',null,'导入与备份'),h('div',{className:'zw-row-actions'},h(LocalFilePicker,{label:'导入工作台',hint:'JSON · 本机备份',accept:'.json,application/json',disabled:locked,onChange:e=>{const file=e.currentTarget.files?.[0];e.currentTarget.value='';void importFile(file);}}),h('button',{disabled:locked,onClick:download},'导出工作台'))),h('p',{className:'zw-error',role:'alert'},error),notice?h('p',{role:'status'},notice):null);
 }
 const SWITCHING_CSS=`
 html[data-ui-stronger-paused] :is(.zw-mark,.zw-pet img,.V4vHZW_runningIcon,.zw-live){animation-play-state:paused!important}
 html[data-ui-stronger-motion] .zs-quiet-tools .zs-page-transition>.zw-panel{animation:none}
 html[data-ui-stronger-motion] .zs-quiet-tools button:active:not(:disabled){transform:translateY(1px)}
 .zs-quiet-tools :is(input,select,textarea):focus-visible{outline:1px solid var(--zw-purple);outline-offset:2px}
 .zs-page-transition{flex:1;min-height:0;overflow:auto}.zs-page-transition>.zw-workspace{overflow:visible}.zs-page-transition>.zw-panel{padding-top:12px}
 html[data-ui-stronger-motion] .zs-page-transition{animation:zs-page-enter 180ms cubic-bezier(.16,1,.3,1) both}
 html[data-ui-stronger-motion] .zs-surface-backdrop[data-leaving]{pointer-events:none;animation:zs-fade-out 140ms ease-in both}
 html[data-ui-stronger-motion] .zs-surface-backdrop[data-leaving]>.zs-tools,html[data-ui-stronger-motion] .zs-surface-backdrop[data-leaving]>.zs-palette{animation:zs-page-exit 140ms ease-in both}
 .zs-thinking{padding:16px 28px 28px}.zs-thinking>p{font-size:12px;line-height:1.8;color:var(--zw-muted)}.zs-thinking button{border:1px solid var(--zw-line);border-radius:var(--zw-radius);background:var(--zw-paper);color:var(--zw-ink);padding:8px 12px;font:inherit;font-size:12px;cursor:pointer}.zs-thinking button:hover{background:var(--zw-soft)}.zs-thinking button:disabled{opacity:.45;cursor:default}.zs-thinking .zw-row-actions{margin:16px 0}.zs-thinking label{font-size:12px}.zs-thinking details>p{font-size:12px;line-height:1.8}.zs-thinking .zw-entries article{align-items:flex-start}.zs-thinking .zw-entries article>div{flex:1}.zs-thinking .zw-entries label{flex:none}.zs-thinking .zw-entries textarea{min-width:0}.zs-thinking .zs-subtle{color:var(--zw-muted);font-size:11px}.zs-thinking>details>summary{color:var(--zw-ink)}@media(max-width:600px){.zs-thinking{padding:12px 20px 24px}}.zs-thinking>details{border-top:1px solid var(--zw-line);padding:17px 0}.zs-thinking summary{cursor:pointer;font-size:12px}.zs-thinking form{display:grid;gap:12px;margin:16px 0}.zs-thinking-understanding label{display:grid;gap:6px;font-size:12px;color:var(--zw-muted)}.zs-thinking :where(input:not([type=checkbox]),textarea,select){box-sizing:border-box;width:100%;min-width:0;max-width:100%;padding:9px 11px;border:1px solid var(--zw-line);border-radius:var(--zw-radius);color:var(--zw-ink);background:var(--zw-paper);font:inherit;font-size:12px;line-height:1.7}.zs-thinking textarea{resize:vertical}.zs-thinking :where(input,textarea,select):focus-visible{outline:2px solid var(--zw-purple);outline-offset:2px}.zs-thinking .zw-row-actions select{flex:1;min-width:120px;width:auto}.zs-thinking small{display:block;color:var(--zw-muted);font-size:10px;overflow-wrap:anywhere}.zs-thinking article{padding:12px 0}.zs-thinking article p{white-space:pre-wrap;overflow-wrap:anywhere}.zs-concepts{display:flex;flex-wrap:wrap;gap:8px;margin:14px 0}.zs-concepts span{padding:6px 10px;border:1px solid var(--zw-line);border-radius:var(--zw-radius);font-size:12px}.zs-thinking li{font-size:12px;line-height:1.9}
 @keyframes zs-page-enter{from{opacity:.7;translate:0 3px}to{opacity:1;translate:0 0}}@keyframes zs-page-exit{to{opacity:0;translate:7px 0}}@keyframes zs-fade-out{to{opacity:0}}
 @media(prefers-reduced-motion:reduce){.zs-quiet-tools button:active{transform:none!important}.zs-page-transition,.zs-surface-backdrop[data-leaving],.zs-surface-backdrop[data-leaving]>*{animation:none!important}}
 `;

 function TeamAccess({store,control,sessionId}){
  const [state,setState]=React.useState(null),[busy,setBusy]=React.useState(false),[error,setError]=React.useState('');
  const writing=React.useRef(false),generation=React.useRef(0),readVersion=React.useRef(0),reload=React.useRef(()=>{});
  React.useEffect(()=>{
   const epoch=++generation.current,controller=new AbortController();let pending=false;
   writing.current=false;setState(null);setBusy(false);setError('');
   const refresh=async()=>{
    if(!sessionId||pending||writing.current||document.hidden)return;
    pending=true;const version=readVersion.current;
    try{const value=await control('teamPolicyStatus',{sessionId},controller.signal);if(generation.current===epoch&&readVersion.current===version){setState(value);setError('');}}
    catch(e){if(generation.current===epoch&&!controller.signal.aborted)setError(e.message);}
    finally{pending=false;}
   };
   reload.current=refresh;void refresh();
   const timer=setInterval(refresh,10000);
   window.addEventListener('ui-stronger-team-policy',refresh);window.addEventListener('focus',refresh);document.addEventListener('visibilitychange',refresh);
   return ()=>{generation.current++;controller.abort();clearInterval(timer);window.removeEventListener('ui-stronger-team-policy',refresh);window.removeEventListener('focus',refresh);document.removeEventListener('visibilitychange',refresh);};
  },[sessionId,control]);
  const update=async patch=>{
   if(writing.current||!state?.editable||!state.available)return;
   const epoch=generation.current;readVersion.current++;writing.current=true;setBusy(true);setError('');
   try{
    const value=await control('teamPolicy',{sessionId,revision:state.revision,...state.policy,...patch});
    if(generation.current!==epoch)return;
    setState({...state,revision:value.revision,policy:value.policies[sessionId]});
    window.dispatchEvent(new CustomEvent('ui-stronger-team-policy'));
   }catch(e){if(generation.current===epoch)setError(e.message);}
   finally{if(generation.current===epoch){writing.current=false;setBusy(false);void reload.current();}}
  };
  return h('div',{className:'zs-team-access'},
   state?.teamMode?null:h('button',{type:'button',className:'zs-team-switch',role:'switch','aria-label':'允许本会话调用子智能体','aria-checked':state?.policy.enabled??false,disabled:busy||!state?.editable||!state.available,onClick:()=>update({enabled:!state.policy.enabled}),title:error||state?.reason||'仅影响当前会话；关闭后停止新派发，已运行任务可在协作面板停止'},h('span',null,'子智能体'),h('span',{className:'zs-switch-track','aria-hidden':true},h('i'))),
   state?.teamMode?null:h('button',{type:'button',className:'zs-team-entry',title:'协作配置与任务进度',onClick:()=>openTools('bots')},'协作'),
   error?h('span',{className:'zs-team-access-error',role:'alert'},error):null);
 }
 function PanelLoadState({message,error,onRetry}){
  return h('div',{className:'zw-row-actions',role:error?'alert':'status'},h('p',null,error||message),error?h('button',{type:'button',onClick:onRetry},'重试'):null);
 }
 function TaskHandoff({task}){
  if(!task.context&&!task.skills?.length&&!task.result&&!task.requireReview)return null;
  return h('details',{className:'zs-team-handoff-details'},h('summary',null,'交接与技能'),
   task.skills?.length?h('p',null,'指定技能 · '+task.skills.join(' / ')):null,
   task.context?h('p',null,task.context):null,
   task.result?h('pre',null,task.result):null,
   task.requireReview?h('small',null,task.review?.decision==='accepted'?'已验收，可交给后续任务':'后续任务等待主角色验收此结果'):null);
 }
 function BotsPanel({store,control}){
  const state=useState(store),[data,setData]=React.useState(null),[draft,setDraft]=React.useState(null),[models,setModels]=React.useState([]),[message,setMessage]=React.useState(''),[busy,setBusy]=React.useState(false),[timeline,setTimeline]=React.useState(null),[reload,setReload]=React.useState(0);const alive=React.useRef(true);
  React.useEffect(()=>{alive.current=true;let active=true;setMessage('');control('bots').then(v=>{if(active)setData(v);}).catch(e=>{if(active)setMessage(e.message);});control('modelCatalog').then(v=>{if(active)setModels(v.providers.flatMap(p=>p.models.map(m=>({provider:p.id,model:m.id}))));}).catch(()=>{});return()=>{active=false;alive.current=false;};},[control,reload]);
  const run=async(action,p)=>{if(busy)return;setBusy(true);setMessage('');try{const v=await control(action,p);if(alive.current){setData(v);setDraft(null);setMessage('已保存到本机。');if(action==='teamPolicy')window.dispatchEvent(new CustomEvent('ui-stronger-team-policy'));}}catch(e){if(alive.current)setMessage(e.message);}finally{if(alive.current)setBusy(false);}};
  React.useEffect(()=>{let active=true,pending=false;setTimeline(null);const refresh=async()=>{if(!state.sessionId||pending||document.hidden)return;pending=true;try{const v=await control('teamTimeline',{sessionId:state.sessionId});if(active)setTimeline(v);}catch(e){if(active)setMessage(e.message);}finally{pending=false;}};void refresh();const timer=setInterval(refresh,4000);document.addEventListener('visibilitychange',refresh);return()=>{active=false;clearInterval(timer);document.removeEventListener('visibilitychange',refresh);};},[state.sessionId,control]);
  if(!data)return h('section',{className:'zw-panel zs-thinking'},h(PanelLoadState,{message:'读取角色…',error:message,onRetry:()=>setReload(value=>value+1)}));
  const save=()=>run('saveBots',{revision:data.revision,profiles:[...data.profiles.filter(p=>p.id!==draft.id),{...draft,skills:draft.skills.filter(Boolean)}]});
  const allTasks=timeline?.tasks??[],latestPlan=allTasks.at(-1)?.plan,currentTasks=latestPlan?allTasks.filter(r=>r.plan===latestPlan||!r.done):allTasks.slice(-8),olderTasks=allTasks.filter(r=>!currentTasks.includes(r));
  const renderTask=r=>h('article',{key:r.id,className:'zs-team-task'},h('div',{className:'zs-team-task-head'},h('b',null,(r.key?r.key+' · ':'')+(r.profile?.name??'子任务')),h('small',null,({'queued':'排队中','blocked':'前置任务受阻','starting':'准备派发','accepted':'已接收','running':'执行中','completed':r.review?.decision==='accepted'?'已验收':'待主角色核验','stop':r.review?.decision==='accepted'?'已验收':'待主角色核验','cancel-requested':'停止请求中','cancelled':'已取消','dispatch-failed':'派发失败','aborted':'已中止','failed':'失败','error':'失败'}[r.status]??r.status))),h('p',null,r.task),h(TaskHandoff,{task:r}),h('small',null,'验收：'+(r.acceptance||'按任务核对结果')),r.dependsOn?.length?h('small',null,'前置：'+r.dependsOn.map(id=>timeline.tasks.find(x=>x.id===id)?.key??id.slice(0,8)).join(' / ')):null,r.resources?.length?h('small',null,'独占范围：'+r.resources.join(' / ')):null,r.report?h('details',null,h('summary',null,'结果与依据'),h('p',null,r.report.summary),...r.report.evidence.map((x,i)=>h('p',{key:i},x)),r.report.blockers?h('p',null,'阻碍：'+r.report.blockers):null):null,r.review?h('small',null,r.review.decision==='accepted'?'主角色已验收':'主角色要求修正'):null,!r.done?h('button',{disabled:busy,onClick:async()=>{setBusy(true);try{const v=await control('cancelTeamTask',{sessionId:state.sessionId,taskId:r.id});if(alive.current){setTimeline(v);setMessage('停止请求已记录。');}}catch(e){if(alive.current)setMessage(e.message);}finally{if(alive.current)setBusy(false);}}},'停止此任务'):null);
  const policy=data.policies?.[state.sessionId]??data.defaultPolicy??{enabled:false,maxParallel:2,maxTasks:8};
  const updatePolicy=patch=>run('teamPolicy',{sessionId:state.sessionId,revision:data.revision,...policy,...patch});
  return h('section',{className:'zw-panel zs-thinking zs-team'},
   h('section',{className:'zs-team-policy','aria-label':'当前会话协作设置'},h('p',{className:'zs-team-policy-state'},policy.enabled?'本会话已允许调用子智能体':'本会话未允许调用子智能体'),h('small',null,!state.sessionId?'先打开或创建一个对话。':policy.enabled?'模型可按任务需要自行分工；简单任务仍直接完成。':'在会话顶部切换「子智能体」。新会话默认关闭。'),h('div',{className:'zs-team-limits'},h('label',null,'单次请求预算',h('select',{'aria-label':'协作任务预算',value:policy.maxTasks,disabled:busy||!state.sessionId,onChange:e=>updatePolicy({maxTasks:Number(e.target.value)})},...[...new Set([4,8,12,24,policy.maxTasks])].filter(n=>n>=policy.maxParallel).sort((a,b)=>a-b).map(n=>h('option',{key:n,value:n},n+' 个'))))),h('small',null,'预算约束本插件每次直接用户请求的派发，工具消息不重置。关闭后不再启动新任务，已运行任务保留，可单独停止。')),
   !data.capabilities.spawn?h('p',null,'当前宿主未提供子智能体服务。'):null,
   h('div',{className:'zw-row-actions'},h('button',{disabled:busy||data.profiles.length>=24,onClick:()=>setDraft({id:crypto.randomUUID(),name:'新角色',role:'child',instructions:'',skills:[],model:null,enabled:true})},'新增角色')),
   timeline?.tasks.length?h('section',{className:'zs-team-board','aria-label':'协作任务看板'},h('header',null,h('b',null,'当前任务'),h('small',null,(timeline.summary?.running??0)+' 进行中 · '+(timeline.summary?.queued??0)+' 排队 · '+(timeline.summary?.awaitingReview??0)+' 待核验')),...currentTasks.map(renderTask),olderTasks.length?h('details',null,h('summary',null,'之前的任务 · '+olderTasks.length),...olderTasks.map(renderTask)):null,timeline.messages.length?h('details',null,h('summary',null,'消息记录 · '+timeline.messages.length),...timeline.messages.slice(-16).map(m=>h('p',{key:m.id},m.from.slice(0,8)+' → '+m.to.slice(0,8)+' · '+(m.delivery==='delivered'?'原生服务已接收':m.delivery==='unknown'?'投递未确认':'已存入收件箱')+(m.acknowledgedAt?' · 已读':'')))):null):null,
   ...data.profiles.map(p=>h('article',{key:p.id},h('b',null,p.name),h('small',null,p.role==='main'?'主智能体':'子智能体',p.enabled?' · 启用':' · 停用',p.model?' · '+p.model.model:' · 跟随当前模型'),h('div',{className:'zw-row-actions'},h('button',{disabled:busy,onClick:()=>setDraft({...p})},'编辑'),p.role==='main'?h('button',{disabled:busy||!state.sessionId||!p.enabled,onClick:()=>run('activateBot',{sessionId:state.sessionId,profileId:p.id})},data.bindings[state.sessionId]===p.id?'重新应用到当前会话':'应用到当前会话'):null,h('button',{disabled:busy,onClick:()=>run('saveBots',{revision:data.revision,profiles:data.profiles.map(x=>x.id===p.id?{...x,enabled:!x.enabled}:x)})},p.enabled?'停用':'启用'),!p.enabled?h('button',{disabled:busy,onClick:()=>run('saveBots',{revision:data.revision,profiles:data.profiles.filter(x=>x.id!==p.id)})},'删除'):null))),
   draft?h('form',{onSubmit:e=>{e.preventDefault();save();}},h('label',null,'名称',h('input',{'aria-label':'角色名称',value:draft.name,maxLength:80,required:true,onChange:e=>setDraft({...draft,name:e.target.value})})),h('label',null,'职责',h('select',{'aria-label':'角色类型',value:draft.role,onChange:e=>setDraft({...draft,role:e.target.value})},h('option',{value:'main'},'主智能体'),h('option',{value:'child'},'子智能体'))),h('label',null,'模型',h('select',{'aria-label':'角色模型',value:draft.model?JSON.stringify(draft.model):'',onChange:e=>setDraft({...draft,model:e.target.value?JSON.parse(e.target.value):null})},h('option',{value:''},'跟随当前会话'),...models.map(m=>h('option',{key:JSON.stringify(m),value:JSON.stringify(m)},m.provider+' / '+m.model)))),h('label',null,'角色指令',h('textarea',{'aria-label':'角色指令',value:draft.instructions,maxLength:4000,onChange:e=>setDraft({...draft,instructions:e.target.value})})),h('label',null,'技能名称（英文逗号分隔）',h('input',{'aria-label':'角色技能',value:draft.skills.join(','),onChange:e=>setDraft({...draft,skills:e.target.value.split(',').map(x=>x.trim())})})),h('small',null,'技能在任务需要时通过原生 skill 加载。主角色指定模型时，应用会切换当前模型，并遵循 DSH 默认模型保存规则。'),h('div',{className:'zw-row-actions'},h('button',{disabled:busy,type:'submit'},'保存角色'),h('button',{disabled:busy,type:'button',onClick:()=>setDraft(null)},'取消'))):null,h('p',{role:'status'},message));
 }
 function TeamRouteEditor({label,value,fallback,catalog,control,onChange}){
  const pair=value.model??fallback,key=pair?JSON.stringify({provider:pair.provider,model:pair.model}):'';
  const [cap,setCap]=React.useState(null),[error,setError]=React.useState('');
  React.useEffect(()=>{let active=true;setCap(null);setError('');if(key)control('modelCapabilities',JSON.parse(key)).then(result=>{if(active)setCap(result);}).catch(e=>{if(active)setError(e.message);});return()=>{active=false;};},[key,control]);
  const selected=value.model?JSON.stringify(value.model):'',efforts=cap?.reasoning?.efforts??[];
  return h('div',{className:'zs-team-route'},h('label',null,label+'模型',h('select',{'aria-label':label+'模型',value:selected,onChange:e=>onChange({model:e.target.value?JSON.parse(e.target.value):null,effort:null})},h('option',{value:''},'跟随上级模型'),selected&&!catalog?.providers.some(p=>p.models.some(m=>JSON.stringify({provider:p.id,model:m.id})===selected))?h('option',{value:selected},value.model.model+'（已保存）'):null,...(catalog?.providers??[]).map(p=>h('optgroup',{key:p.id,label:p.name||p.id},...p.models.map(m=>h('option',{key:m.id,value:JSON.stringify({provider:p.id,model:m.id})},m.name||m.id)))))),h('label',null,'思考强度',h('select',{'aria-label':label+'思考强度',value:value.effort??'',disabled:!cap,onChange:e=>onChange({...value,effort:e.target.value||null})},h('option',{value:''},cap?'跟随上级强度':'读取强度…'),h('option',{value:'__default__'},'模型默认'),value.effort&&value.effort!=='__default__'&&!efforts.some(row=>row.id===value.effort)?h('option',{value:value.effort},value.effort+'（已保存）'):null,...efforts.map(row=>h('option',{key:row.id,value:row.id},row.name||row.id)))),error?h('p',{role:'alert',className:'zw-error'},error):null);
 }
 function TeamConfiguration({data,control,onSave,onClose,target={}}){
  const [draft,setDraft]=React.useState(()=>({coordinator:structuredClone(data.coordinator),defaults:structuredClone(data.defaults),members:target.newMember?[...structuredClone(data.members),{id:'team-'+crypto.randomUUID(),name:'新子智能体',identity:'',duties:'',model:null,effort:null,enabled:true}]:structuredClone(data.members)})),[catalog,setCatalog]=React.useState(null),[current,setCurrent]=React.useState(null),[error,setError]=React.useState(''),[busy,setBusy]=React.useState(false);
  const alive=React.useRef(true),writing=React.useRef(false),revision=React.useRef(data.revision);
  React.useEffect(()=>{alive.current=true;control('modelCatalog').then(value=>{if(alive.current)setCatalog(value);}).catch(e=>{if(alive.current)setError(e.message);});control('modelStatus',{sessionId:data.sessionId}).then(value=>{if(alive.current)setCurrent(value.next??value.last);}).catch(()=>{});return()=>{alive.current=false;};},[control,data.sessionId]);
  const focusId=target.memberId??(target.newMember?draft.members.at(-1)?.id:null);
  const focused=!!focusId||!!target.main;
  const updateMember=(id,patch)=>setDraft(old=>({...old,members:old.members.map(row=>row.id===id?{...row,...patch}:row)}));
  const save=async()=>{if(writing.current)return;writing.current=true;setBusy(true);setError('');try{await control('configureTeam',{sessionId:data.sessionId,revision:revision.current,configuration:draft});if(alive.current)onSave();}catch(e){if(alive.current)setError(e.message);}finally{writing.current=false;if(alive.current)setBusy(false);}};
  return h(Modal,{className:'zs-workspace-dialog zs-team-config',open:true,title:target.main?'主智能体设置':focusId?'子智能体设置':'团队配置',closeLabel:'关闭团队配置',onClose:()=>{if(!writing.current)onClose();},footer:h(React.Fragment,null,h(Button,{variant:'outline',disabled:busy,onClick:onClose},'取消'),h(Button,{variant:'outline',disabled:busy,onClick:()=>void save()},busy?'保存中…':'保存团队配置'))},
   h('fieldset',{disabled:busy,className:'zs-team-config-body'},!focusId?h('section',null,h('h3',null,'主智能体'),h('label',{className:'zs-form-field'},'名称',h('input',{'aria-label':'主智能体名称',autoFocus:target.main&&target.field==='name',value:draft.coordinator.name??'主智能体',maxLength:80,onChange:event=>setDraft(old=>({...old,coordinator:{...old.coordinator,name:event.target.value}}))})),h('p',{className:'zs-subtle'},'负责分配任务、跟进阶段汇报与整合结果。'),h(TeamRouteEditor,{label:'主协调员',value:draft.coordinator,fallback:current,catalog,control,onChange:value=>setDraft(old=>({...old,coordinator:{...old.coordinator,...value}}))}),h('label',{className:'zs-form-field'},'协调要求',h('textarea',{'aria-label':'主协调员要求',value:draft.coordinator.instructions,maxLength:4000,rows:3,onChange:e=>setDraft(old=>({...old,coordinator:{...old.coordinator,instructions:e.target.value}}))}))):null,
   !focused?h('section',null,h('h3',null,'全体子智能体默认设置'),h('p',{className:'zs-subtle'},'由你管理子智能体名单。停用后停止新派发。删除子智能体会清除其独立记忆。'),h(TeamRouteEditor,{label:'子智能体默认',value:draft.defaults,fallback:draft.coordinator.model??current,catalog,control,onChange:value=>setDraft(old=>({...old,defaults:value}))}),h('button',{type:'button',onClick:()=>setDraft(old=>({...old,members:old.members.map(row=>({...row,model:null,effort:null}))}))},'应用默认设置到全部子智能体')):null,
   ...draft.members.filter(member=>!target.main&&(!focusId||member.id===focusId)).map((member,index)=>h('section',{key:member.id,className:'zs-team-member-form'},h('div',{className:'zw-row-actions'},h('h3',null,'子智能体 '+(index+1)),h('label',null,h('input',{type:'checkbox',checked:member.enabled,onChange:e=>updateMember(member.id,{enabled:e.target.checked})}),'启用'),h('button',{type:'button',onClick:()=>setDraft(old=>({...old,members:old.members.filter(row=>row.id!==member.id)}))},'删除子智能体')),h('label',{className:'zs-form-field'},'名称',h('input',{'aria-label':'子智能体'+(index+1)+'名称',autoFocus:focusId===member.id&&target.field==='name',value:member.name,maxLength:80,onChange:e=>updateMember(member.id,{name:e.target.value})})),h('label',{className:'zs-form-field'},'身份定位',h('textarea',{'aria-label':'子智能体'+(index+1)+'身份定位',value:member.identity,maxLength:1600,rows:2,onChange:e=>updateMember(member.id,{identity:e.target.value})})),h('label',{className:'zs-form-field'},'职责与验收要求',h('textarea',{'aria-label':'子智能体'+(index+1)+'职责',value:member.duties,maxLength:4000,rows:3,onChange:e=>updateMember(member.id,{duties:e.target.value})})),h(TeamRouteEditor,{label:'子智能体'+(index+1),value:member,fallback:draft.defaults.model??draft.coordinator.model??current,catalog,control,onChange:value=>updateMember(member.id,value)}))),
   h('p',{className:'zs-subtle'},'模型与强度设置在下次请求时生效，身份与职责用于新派发任务。'),!focused?h('button',{type:'button',disabled:draft.members.length>=8,onClick:()=>setDraft(old=>({...old,members:[...old.members,{id:'team-'+crypto.randomUUID(),name:'新子智能体',identity:'',duties:'',model:null,effort:null,enabled:true}]}))},'添加子智能体'):null,error?h('p',{role:'alert',className:'zw-error'},error):null));
 }
 const TEAM_STATUS={'delivery-unknown':'连接中断',queued:'排队',starting:'派发中',accepted:'已接收',running:'进行中',completed:'已完成',stop:'已完成',blocked:'受阻',failed:'失败',error:'失败','dispatch-failed':'派发失败',cancelled:'已取消',aborted:'已中止','cancel-requested':'停止请求中'};
 function TeamRowMenu({name,coordinator=false,onSelect}){
  const [open,setOpen]=React.useState(false);
  const items=coordinator?[{id:'rename',label:'重命名'},{id:'edit',label:'模型与协调要求'}]:[
   {id:'rename',label:'重命名'},{id:'edit',label:'编辑身份与职责'},{id:'model',label:'模型与思考强度'},{id:'delete',label:'删除子智能体'}];
  return h(Menu,{open,onClose:()=>setOpen(false),items,onSelect:id=>{setOpen(false);onSelect(id);},align:'end',portal:true,
   className:'zs-team-row-menu',listClassName:'zs-team-member-menu',
   anchor:h('button',{type:'button',className:'zs-team-member-more','aria-label':name+'的操作','aria-haspopup':'menu','aria-expanded':open,onClick:()=>setOpen(value=>!value)},
    h('svg',{viewBox:'0 0 18 18',width:18,height:18,'aria-hidden':true,fill:'currentColor'},...[4,9,14].map(x=>h('circle',{key:x,cx:x,cy:9,r:1}))))});
 }
 function TeamMemberRemoval({data,member,control,onClose,onSave}){
  const [busy,setBusy]=React.useState(false),[error,setError]=React.useState('');
  const writing=React.useRef(false),alive=React.useRef(true);
  React.useEffect(()=>{alive.current=true;return()=>{alive.current=false;};},[]);
  const remove=async()=>{
   if(writing.current)return;writing.current=true;setBusy(true);setError('');
   try{await control('configureTeam',{sessionId:data.sessionId,revision:data.revision,configuration:{coordinator:data.coordinator,defaults:data.defaults,members:data.members.filter(row=>row.id!==member.id)}});if(alive.current)onSave();}
   catch(error){if(alive.current)setError(error.message);}
   finally{writing.current=false;if(alive.current)setBusy(false);}
  };
  return h(Modal,{open:true,className:'zs-workspace-dialog zs-team-config',title:'删除子智能体？',closeLabel:'关闭删除子智能体确认',onClose:()=>{if(!writing.current)onClose();},
   footer:h(React.Fragment,null,h(Button,{variant:'outline',disabled:busy,onClick:onClose},'取消'),h(Button,{variant:'outline',disabled:busy,onClick:()=>void remove()},busy?'删除中…':'删除子智能体'))},
   h('p',null,'删除“'+member.name+'”及其独立记忆。历史会话和任务记录保留。'),
   h('p',{className:'zs-subtle'},'删除时会中断正在执行的任务，并取消该子智能体的排队任务。'),error?h('p',{role:'alert',className:'zw-error'},error):null);
 }
 function TeamMemberChatView(props){return props.renderSlot('conversation.session',{view:'chat'});}
 function TeamMemberConversation(props){
  const session=props.useSession(value=>value),conversation=props.useConversation(value=>value);
  const summaryBlank=props.useSessions(state=>state.byId[props.sessionId]?.blank);
  if(!session||!conversation)return h('p',{role:'status'},'正在读取子智能体对话…');
  if(session.openState==='error'||session.openState==='failed')return h('p',{role:'alert',className:'zw-error'},'子智能体会话加载失败，请返回详情查看启动错误。');
  const active=conversation.activeTargets.size>0||!session.blank&&!session.awaitingFirstTurn||session.running;
  const settling=!active&&session.openState==='loading'&&summaryBlank!==true;
  const hero=!active&&(session.openState==='open'||summaryBlank===true);
  return props.renderFactorySlot('conversation.content',{variant:'embedded',phase:settling?'settling':hero?'hero':'active',hero},{slots:{views:TeamMemberChatView}});
 }
 function NativeTeamMemberChat({ctx,parentSessionId,childSessionId,SessionProvider,renderSlot}){
  const [reference,setReference]=React.useState(null),[error,setError]=React.useState(''),[version,setVersion]=React.useState(0);
  React.useEffect(()=>{
   let active=true,reference;const controller=new AbortController();setReference(null);setError('');
   try{
    const sessions=ctx.get('sessions');if(!sessions?.retain||!SessionProvider||!renderSlot)throw Error('当前宿主尚未准备好子智能体对话');
    reference=sessions.retain({parentSessionId,childSessionId,mode:'continuable'},{source:'controllerOperation',signal:controller.signal});
    Promise.resolve(reference.ready).then(()=>{if(active)setReference(reference);}).catch(error=>{if(active)setError(error.message);});
   }catch(error){setError(error.message);}
   return()=>{active=false;controller.abort();reference?.release();};
  },[ctx,parentSessionId,childSessionId,version]);
  if(error)return h('div',{className:'zs-team-chat-error',role:'alert'},h('p',null,error),h('button',{type:'button',onClick:()=>setVersion(value=>value+1)},'重试'));
  if(!reference)return h('p',{className:'zs-team-chat-loading',role:'status'},'正在读取子智能体对话…');
  return h(SessionProvider,{session:reference},renderSlot('ui-stronger.team.member.chat',{}));
 }

 function TeamSymbol({coordinator=false}={}){
  return h('svg',{className:'zs-team-symbol',viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:1.35,'aria-hidden':true},
   h('path',{d:coordinator?'m12 2 4 4-4 4-4-4Zm-6 11 3 3-3 3-3-3Zm12 0 3 3-3 3-3-3ZM12 10v3M6 13v-2h12v2':'m12 3 6 4v10l-6 4-6-4V7Zm0 0v18M6 7l6 4 6-4'}));
 }
 function MemberComposer({data,member,control,onRefresh}){
  const online=data.members.filter(row=>row.enabled).some(row=>row.id===member.id);
  const [draft,setDraft]=React.useState(''),[busy,setBusy]=React.useState(false),[error,setError]=React.useState('');
  const pending=React.useRef(null),alive=React.useRef(true);React.useEffect(()=>{alive.current=true;return()=>{alive.current=false;};},[]);
  const send=async event=>{event.preventDefault();if(busy||!draft.trim())return;const content=draft.trim();if(!pending.current||pending.current.content!==content)pending.current={content,key:crypto.randomUUID()};setBusy(true);setError('');try{await control('sendTeamMember',{sessionId:data.sessionId,profileId:member.id,...pending.current});if(alive.current){setDraft('');pending.current=null;onRefresh();}}catch(error){if(alive.current)setError(error.message);}finally{if(alive.current)setBusy(false);}};
  const model=member.model??data.defaults.model??data.coordinator.model;
  return h('form',{className:'zs-team-member-composer',onSubmit:send},
   h('textarea',{className:'zs-team-member-input','aria-label':'发给'+member.name,value:draft,maxLength:4000,rows:3,placeholder:'发送消息…',onChange:event=>setDraft(event.target.value),onKeyDown:event=>{if(event.key==='Enter'&&!event.shiftKey&&!event.nativeEvent.isComposing){event.preventDefault();void send(event);}}}),
   h('div',{className:'zs-team-member-controls'},h('small',{className:'zs-team-member-model'},model?.model??'跟随上级模型'),h('button',{className:'zs-team-member-send',type:'submit','aria-label':'发送给'+member.name,disabled:busy||!online||!draft.trim()},h(NavIcon,{kind:'arrow'}))),
   error?h('p',{role:'alert',className:'zw-error'},error):null);
 }
 function MemberMemory({data,member,control,onRefresh}){
  const [content,setContent]=React.useState(''),[busy,setBusy]=React.useState(false),[error,setError]=React.useState('');
  const rows=data.memberMemories?.[member.id]??[];
  const update=async payload=>{if(busy)return;setBusy(true);setError('');try{await control('teamMemberMemory',{sessionId:data.sessionId,profileId:member.id,...payload});setContent('');onRefresh();}catch(error){setError(error.message);}finally{setBusy(false);}};
  return h('details',{className:'zs-team-memory'},h('summary',null,'独立记忆 · '+rows.length),
   ...rows.map(row=>h('article',{key:row.key},h('p',null,row.content),h('button',{type:'button',disabled:busy,onClick:()=>void update({operation:'forget',key:row.key})},'删除记忆'))),
   h('form',{onSubmit:event=>{event.preventDefault();void update({operation:'remember',key:crypto.randomUUID(),content:content.trim()});}},h('label',null,'仅此子智能体保存',h('textarea',{'aria-label':member.name+'独立记忆',value:content,maxLength:600,rows:3,onChange:event=>setContent(event.target.value)})),h('button',{type:'submit',disabled:busy||!content.trim()},busy?'保存中…':'保存记忆')),
   error?h('p',{role:'alert',className:'zw-error'},error):null);
 }
 const EMPTY_TEAM_STATUS=new Map();
 function teamActivity(live,task,enabled=true,review){
  if(live?.pendingInteraction)return {state:'approval',label:'待审核'};
  if(review?.pending)return {state:'reviewing',label:'审查中'};
  if(live?.running===true||review?.running===true)return {state:'running',label:'工作中'};
  if(task&&!task.done){
   if(review?.decision==='deny')return {state:'blocked',label:'审查拒绝'};
   return {state:task.status,label:TEAM_STATUS[task.status]??task.status};
  }
  if(task?.done&&['completed','success'].includes(task.status)&&task.requireReview&&task.review?.decision!=='accepted')return {state:'approval',label:'待验收'};
  if(task?.done&&['failed','error','blocked','dispatch-failed'].includes(task.status))return {state:'error',label:'需处理'};
  if(task?.done&&['cancelled','interrupted'].includes(task.status))return {state:'stopped',label:'已停止'};
  return {state:enabled?'idle':'offline',label:enabled?'待机':'已停用'};
 }
 function TeamAgentStatus({value}){
  return h('span',{className:'zs-team-agent-status','data-state':value.state,role:'status'},h('i',{'aria-hidden':true}),value.label);
 }
 function TeamWorkspace({data,control,onRefresh,openMember,renderMemberChat,liveStatuses=EMPTY_TEAM_STATUS,children}){
  const [config,setConfig]=React.useState(null),[removing,setRemoving]=React.useState(null),[memberTab,setMemberTab]=React.useState('chat'),[expanded,setExpanded]=React.useState(null),[stopping,setStopping]=React.useState(null),[error,setError]=React.useState('');
  const [visited,setVisited]=React.useState([]);
  React.useEffect(()=>{setExpanded(null);setVisited([]);setConfig(null);setRemoving(null);setError('');},[data.sessionId]);
  const selectMember=id=>{setVisited(ids=>ids.includes(id)?ids:[...ids,id]);setExpanded(id);};
  const stop=async taskId=>{if(stopping)return;setStopping(taskId);setError('');try{await control('cancelTeamTask',{sessionId:data.sessionId,taskId});onRefresh();}catch(error){setError(error.message);}finally{setStopping(null);}};
  const team=data.requested,tasks=data.timeline.tasks;
  const members=data.members;
  const currentTask=member=>{const rows=tasks.filter(task=>task.profile.id===member.id);return rows.findLast(row=>!row.done)??rows.at(-1);};
  const selected=team?members.find(member=>member.id===expanded):null;
  React.useEffect(()=>setMemberTab('chat'),[expanded]);
  const memberAction=(member,action)=>{if(action==='delete')setRemoving(member);else setConfig({memberId:member.id,field:action==='rename'?'name':action==='model'?'model':'identity'});};
  const renderMember=member=>{
   const current=currentTask(member),child=tasks.findLast(task=>task.profile.id===member.id&&task.childId&&task.status!=='dispatch-failed'&&task.dispatchError!=='NATIVE_CHILD_NOT_CREATED');
   const activity=teamActivity(liveStatuses.get(child?.childId),current,member.enabled,data.activity?.[child?.childId]);
   const status=activity.label;
   return h('article',{key:member.id,className:'zs-team-member zs-team-member-row','data-state':current?.status??'idle'},
    h('button',{type:'button',className:'zs-team-person','aria-pressed':selected?.id===member.id,'aria-label':member.name+' · '+status,title:status,onClick:()=>selectMember(member.id)},
     h(TeamSymbol),h('strong',null,member.name),h(TeamAgentStatus,{value:activity})),h(TeamRowMenu,{name:member.name,onSelect:action=>memberAction(member,action)}));
  };
  const renderDetail=member=>{
   const rows=tasks.filter(task=>task.profile.id===member.id),current=currentTask(member),report=current?.report;
   const model=current?.modelUse??member.model??data.defaults.model??data.coordinator.model;
   const effort=current?.modelUse?current.modelUse.effort:member.effort??data.defaults.effort;
   const childrenIds=new Set(rows.map(row=>row.childId).filter(Boolean)),messages=data.messages.filter(message=>childrenIds.has(message.from)||childrenIds.has(message.to));
   return h('div',{className:'zs-team-detail-view','aria-label':member.name+'详情'},h('header',{className:'zs-team-detail-header'},h(TeamSymbol),h('h2',null,member.name),h('small',null,current?(TEAM_STATUS[current.status]??current.status):'待分配')),
    h('div',{className:'zs-team-member-detail'},h('p',null,member.identity),member.duties?h('p',{className:'zs-subtle'},member.duties):null,
     h(MemberMemory,{key:member.id,data,member,control,onRefresh}),
     h('small',null,(member.historical?'已保存任务 · ':'')+(model?.model??'跟随上级模型')+(effort?' · '+(effort==='__default__'?'模型默认':effort):'')),
     current?h(React.Fragment,null,h('h3',null,'当前任务'),h('p',null,current.task),report?.percent!=null?h('div',{className:'zs-team-progress'},h('progress',{max:100,value:report.percent}),'子智能体自报 '+report.percent+'%'):null,
      h('p',{className:'zs-team-last-report'},current.result||report?.summary||(current.done?'任务已结束，暂无文字结果':'等待子智能体阶段汇报')),current.childId&&openMember?h('button',{type:'button',onClick:()=>openMember(current.childId)},'完整会话'):null,report?.blockers?h('p',{className:'zw-error'},report.blockers):null,
      ...rows.slice(-6).map(row=>h('details',{key:row.id,open:row.id===current.id},h('summary',null,row.task.slice(0,80)),h('p',null,'验收 · '+(row.acceptance||'提供结果与依据')),h(TaskHandoff,{task:row}),row.dispatchError?h('p',{className:'zw-error'},'启动错误 · '+row.dispatchError+(row.dispatchFailure?' · '+row.dispatchFailure:'')):null,
       ...(row.progress??[]).map((step,index)=>h('article',{key:index},h('small',null,new Date(step.at).toLocaleTimeString()+' · '+({plan:'计划',work:'执行',verify:'核验',blocked:'受阻',done:'提交结果'}[step.stage]??'汇报')),h('p',null,step.summary),step.evidence?.length?h('ul',null,...step.evidence.map((item,i)=>h('li',{key:i},item))):null)),
       row.review?h('p',null,row.review.decision==='accepted'?'主模型已验收':'主模型要求修正'):null)),
      !current.done?h('button',{type:'button',disabled:!!stopping,onClick:()=>void stop(current.id)},stopping===current.id?'停止请求中…':'停止任务'):null):h('p',{className:'zs-subtle'},'尚未分配任务'),
     messages.length?h('details',{className:'zs-team-messages'},h('summary',null,'通信记录 · '+messages.length),...messages.map(message=>h('p',{key:message.id},message.from.slice(0,8)+' → '+message.to.slice(0,8)+' · '+(message.acknowledgedAt?'已确认':message.delivery==='delivered'?'已投递':'收件箱')+' · '+message.text))):null));
  };
  // The native conversation stays mounted at one stable reconciliation path.
  return h('div',{className:team?'zs-team-workspace':'zs-team-layout-idle'},
   h('section',{className:'zs-team-coordinator','aria-label':team?'团队工作区':undefined},null,
    h('div',{className:'zs-team-main-conversation',hidden:!!selected},children),
    ...visited.map(id=>members.find(member=>member.id===id)).filter(Boolean).map(member=>{
     const visible=selected?.id===member.id,details=visible&&memberTab==='details';
     const child=tasks.findLast(task=>task.profile.id===member.id&&task.childId&&task.status!=='dispatch-failed'&&task.dispatchError!=='NATIVE_CHILD_NOT_CREATED');
     return h('section',{key:member.id,className:'zs-team-member-view',hidden:!visible,'aria-label':member.name+'对话'},
      h('header',{className:'zs-team-chat-header'},h('strong',null,member.name),h('nav',{'aria-label':'子智能体视图'},...['chat','details'].map(tab=>h('button',{key:tab,type:'button','aria-pressed':memberTab===tab,onClick:()=>setMemberTab(tab)},tab==='chat'?'对话':'详情')))),
      details?renderDetail(member):null,
      h('div',{className:'zs-team-chat-pane',hidden:details},child&&renderMemberChat?h('div',{key:child.childId,className:'zs-team-native-chat','data-team-child':child.childId},renderMemberChat(child.childId)):h('div',{className:'zs-team-new-chat'},h('div',{className:'zs-team-new-chat-space'},h('p',null,member.name),h('small',null,member.identity)),h(MemberComposer,{key:member.id,data,member,control,onRefresh}))));
    })),
   team?h('aside',{className:'zs-team-roster','aria-label':'团队子智能体'},
    h('header',null,h('strong',null,'团队'),h('small',null,'子智能体 '+data.members.filter(row=>row.enabled).length),h('button',{type:'button',onClick:()=>setConfig({})},'团队配置')),
    h('div',{className:'zs-team-roster-scroll'},
     h('section',{className:'zs-team-lead-section','aria-label':'主智能体'},h('small',{className:'zs-team-section-label'},'主智能体'),h('div',{className:'zs-team-member-row'},h('button',{type:'button',className:'zs-team-person zs-team-lead','aria-pressed':!selected,onClick:()=>setExpanded(null)},h(TeamSymbol,{coordinator:true}),h('strong',null,data.coordinator.name??'主智能体'),h(TeamAgentStatus,{value:teamActivity(liveStatuses.get(data.sessionId),null,true,data.activity?.[data.sessionId])})),h(TeamRowMenu,{name:data.coordinator.name??'主智能体',coordinator:true,onSelect:action=>setConfig({main:true,field:action==='rename'?'name':'model'})}))),
     h('section',{className:'zs-team-members','aria-label':'子智能体'},h('div',{className:'zs-team-section-header'},h('small',{className:'zs-team-section-label'},'子智能体'),h('button',{type:'button',className:'zs-team-member-more','aria-label':'添加子智能体',disabled:members.length>=8,onClick:()=>setConfig({newMember:true,field:'name'})},'+')),data.loading?h('p',{className:'zs-team-member-skeleton',role:'status'},'正在读取子智能体…'):null,...members.map(renderMember)))) :null,
   error?h('p',{role:'alert',className:'zw-error zs-team-action-error'},error):null,
   config?h(TeamConfiguration,{data,control,target:config,onClose:()=>setConfig(null),onSave:()=>{setConfig(null);onRefresh();}}):null,removing?h(TeamMemberRemoval,{data,member:removing,control,onClose:()=>setRemoving(null),onSave:()=>{if(expanded===removing.id)setExpanded(null);setRemoving(null);onRefresh();}}):null);
 }

 function wireTeamCatalog(ctx){ctx.effect(()=>{
  let dispose;const attach=()=>{if(dispose)return;const entry=ctx.slots.entriesOfSlot('conversation.session.header.actions').find(row=>row.options?.id==='subagent-catalog');if(!entry?.component)return;const Original=entry.component;
   function Catalog(props){const [team,setTeam]=React.useState(()=>modeIntents.get(ctx)?.get(props.sessionId)?.presetId==='team');React.useEffect(()=>{let active=true;const change=event=>{if(event.detail?.sessionId===props.sessionId)setTeam(event.detail.presetId==='team');};window.addEventListener('ui-stronger-mode-change',change);callControl(ctx,'sessionPresetStatus',{sessionId:props.sessionId}).then(value=>{if(active&&!modeIntents.get(ctx)?.get(props.sessionId)?.pending)setTeam(value.requested==='team');}).catch(()=>{});return()=>{active=false;window.removeEventListener('ui-stronger-mode-change',change);};},[props.sessionId]);return team?null:h(Original,{...props,t:(key,...args)=>String(key).startsWith('count.total.')?'累计 '+props.t(key,...args):props.t(key,...args)});}
   dispose=ctx.slots.register({...entry.options,name:'conversation.session.header.actions',inject:entry.inject??entry.options.inject,locale:entry.locale??entry.options.locale,...entry.store?{store:entry.store}:{},priority:Math.min(-100,(entry.options.priority??0)-1)},Catalog);
  };const off=ctx.slots.subscribe('conversation.session.header.actions',attach);attach();return()=>{off();dispose?.();};
 },'ui-stronger: distinguish historical children');}
 function TeamWorkspacePortal(props){
    const [sessionId,setSessionId]=React.useState(props.sessionId),ctx=props.ctx,anchor=React.useRef(null),[seat,setSeat]=React.useState(null);
    React.useLayoutEffect(()=>{
     const root=anchor.current?.closest('.an3WzG_root');if(!root)return;
     const target=document.createElement('div');target.className='zs-team-portal';root.append(target);setSeat(target);
     const measure=()=>{setSessionId(root.querySelector('[data-conversation-session]')?.getAttribute('data-conversation-session')||undefined);const header=root.querySelector(':scope > .an3WzG_header');target.style.top=(header?.getBoundingClientRect().height??0)+'px';};
     measure();const observer=new ResizeObserver(measure);observer.observe(root);
     const contentObserver=new MutationObserver(measure);contentObserver.observe(root,{childList:true,subtree:true,attributes:true,attributeFilter:['data-conversation-session']});
     const header=root.querySelector(':scope > .an3WzG_header');if(header)observer.observe(header);
     return()=>{observer.disconnect();contentObserver.disconnect();target.remove();root.classList.remove('zs-team-native-root');};
    },[]);
    const [data,setData]=React.useState(null),[mode,setMode]=React.useState(()=>modeIntents.get(ctx)?.get(sessionId)?.presetId==='team'?true:null),[error,setError]=React.useState(''),[version,setVersion]=React.useState(0);
    const control=React.useCallback((action,payload={},signal)=>callControl(ctx,action,payload,signal),[]);
    const identity=React.useRef(sessionId);
    React.useEffect(()=>{
     let active=true,pending=false,generation=0,request,optimisticMode=null;
     const intent=modeIntents.get(ctx)?.get(sessionId);optimisticMode=intent?.pending?intent.presetId==='team':null;
     if(identity.current!==sessionId){setData(null);identity.current=sessionId;}setMode(intent?intent.presetId==='team':null);
     if(!sessionId)return;
     const refresh=async(force=false)=>{
      if(!active||document.hidden||optimisticMode!==null||pending&&!force)return;
      const current=++generation;request?.abort();request=new AbortController();const signal=request.signal;pending=true;
      try{const value=await control('teamView',{sessionId:sessionId},signal);if(active&&current===generation){setData(value);setMode(value.requested);setError('');}}
      catch(error){if(active&&current===generation&&!signal.aborted)setError(error.message);}
      finally{if(current===generation)pending=false;}
     };
     const changed=event=>{if(event.detail?.sessionId!==sessionId)return;optimisticMode=event.detail.pending?event.detail.presetId==='team':null;generation++;request?.abort();pending=false;setMode(event.detail.presetId==='team');if(optimisticMode===null)void refresh(true);};
     void refresh();const timer=setInterval(()=>void refresh(),4000);
     window.addEventListener('ui-stronger-mode-change',changed);
     return()=>{active=false;generation++;request?.abort();clearInterval(timer);window.removeEventListener('ui-stronger-mode-change',changed);};
    },[sessionId,control,version]);

    const liveStatuses=props.useSessionStatus?.(snapshot=>snapshot)??EMPTY_TEAM_STATUS;
    const view=data??{sessionId:sessionId,requested:false,coordinator:{},defaults:{},members:[],timeline:{tasks:[],summary:{}},messages:[],loading:true};
    const catalog=ctx.slots.entriesOfSlot('conversation.session.header.actions').find(entry=>entry.options?.id==='subagent-catalog');const actions=catalog?.inject?.(sessionId);
    const openMember=typeof actions?.openChildAside==='function'?childSessionId=>actions.openChildAside({parentSessionId:sessionId,childSessionId,mode:'continuable'}):undefined;
    const requested=mode??view.requested;
    React.useLayoutEffect(()=>{const root=seat?.parentElement;if(!root)return;root.classList.toggle('zs-team-native-root',!!requested);return()=>root.classList.remove('zs-team-native-root');},[seat,requested]);
    return h(React.Fragment,null,h('span',{ref:anchor,hidden:true,'data-team-anchor':true}),seat&&sessionId?ReactDOM.createPortal(h(TeamWorkspace,{key:sessionId,liveStatuses,data:{...view,requested},control,openMember,renderMemberChat:childSessionId=>h(NativeTeamMemberChat,{ctx,parentSessionId:sessionId,childSessionId,SessionProvider:props.SessionProvider,renderSlot:props.renderSlot}),onRefresh:()=>setVersion(value=>value+1)},error?h('p',{className:'zs-team-load-error',role:'status'},'团队状态暂不可用，正在重试'):null),seat):null);
   }
 const TEAM_CSS=`
 .zs-team-portal{display:none;position:absolute;inset:0;z-index:3;pointer-events:none;min-width:0;min-height:0}
 .zs-team-native-root{position:relative!important;flex:1;min-width:0;width:100%;height:100%;--zs-team-rail:clamp(164px,21%,224px)}
 .zs-team-native-root>.zs-team-portal{display:block}
 .zs-team-native-root>.an3WzG_body{margin-inline-start:var(--zs-team-rail);min-width:0}
 .zs-team-portal .zs-team-roster,.zs-team-portal .zs-team-detail-view{pointer-events:auto}
 .zs-team-portal .zs-team-workspace,.zs-team-portal .zs-team-coordinator{background:transparent}
 .zs-team-portal .zs-team-main-conversation{display:none}
 .zs-team-portal .zs-team-detail-view{background:var(--zw-paper);height:100%;box-sizing:border-box}
 .zs-team-native-root:has(.zs-team-detail-view)>.an3WzG_body{visibility:hidden;pointer-events:none}
 @media(max-width:560px){.zs-team-native-root{--zs-team-rail:116px}.zs-team-portal .zs-team-workspace{grid-template-columns:116px minmax(0,1fr)}}

 html:not([data-ui-stronger]) :is(.zs-team-workspace,.zs-team-config){--zw-paper:var(--dsw-alias-bg-base,#f3f3f5);--zw-panel:var(--dsw-alias-bg-module,#ececef);--zw-line:var(--dsw-alias-border-l2,#d8d7df);--zw-ink:var(--dsw-alias-label-primary,#37363d);--zw-muted:var(--dsw-alias-label-secondary,#6c6973);--zw-purple:var(--dsw-alias-brand-primary,#aa98bd);--zw-deep:var(--dsw-alias-brand-primary,#75628e);--zw-soft:var(--dsw-alias-interactive-bg-hover,#e9e5ee)}
 .zs-team-layout-idle,.zs-team-layout-idle>.zs-team-coordinator,.zs-team-layout-idle>.zs-team-coordinator>.zs-team-main-conversation{display:contents}
 .zs-team-workspace{display:grid;grid-template-columns:clamp(164px,21%,224px) minmax(0,1fr);grid-template-rows:minmax(0,1fr);flex:1;min-width:0;min-height:0;width:100%;height:100%;overflow:hidden;isolation:isolate;color:var(--zw-ink);background:var(--zw-paper);font:12px/1.65 var(--hud-mono,ui-monospace,monospace)}
 .zs-team-coordinator{grid-column:2;grid-row:1;display:flex;flex-direction:column;min-width:0;min-height:0;overflow:hidden;background:var(--zw-paper)}
 .zs-team-main-conversation{display:flex;flex-direction:column;flex:1;min-width:0;min-height:0;position:relative;overflow:hidden}
 .zs-team-main-conversation>*{min-width:0;min-height:0;flex:1}
 .zs-team-workspace .an3WzG_root{min-width:0;min-height:0;width:100%;height:100%}
 html[data-ui-stronger] .zs-team-workspace .an3WzG_root[data-phase=hero] .an3WzG_composerSeat{min-height:0;flex:1}
 html[data-ui-stronger] .zs-team-workspace .an3WzG_composerHero{width:calc(100% - 32px);max-width:100%;min-width:0;margin-inline:auto;padding:16px 0 20px}
 html[data-ui-stronger] .zs-team-workspace .zs-quiet-home{min-height:min(210px,30vh);width:100%;padding:24px 18px 16px}
 .zs-team-roster{grid-column:1;grid-row:1;display:flex;flex-direction:column;min-width:0;min-height:0;overflow:hidden;border-right:1px solid var(--zw-line);background:var(--zw-panel)}
 .zs-team-roster>header{display:flex;align-items:center;justify-content:space-between;gap:6px;flex:none;min-height:48px;padding:8px 10px;box-sizing:border-box;border-bottom:1px solid var(--zw-line)}
 .zs-team-memory textarea{width:100%;box-sizing:border-box;min-height:76px;padding:10px;background:var(--zw-paper);color:var(--zw-ink);border:1px solid var(--zw-line);border-radius:6px;font:inherit}.zs-team-memory article{border-bottom:1px solid var(--zw-line);padding-block:10px}.zs-team-memory form{display:grid;gap:10px;padding-block:12px}.zs-team-memory label{display:grid;gap:6px}
 .zs-team-roster>header>small{font-size:10px;color:var(--zw-muted);white-space:nowrap}
 .zs-team-roster>header>strong{font-weight:500;white-space:nowrap}
 .zs-team-roster-scroll{flex:1;min-height:0;min-width:0;overflow:auto;overscroll-behavior:contain;scrollbar-width:thin;padding:6px;box-sizing:border-box}
 .zs-team-members{display:flex;flex-direction:column;gap:4px;min-width:0;margin-top:8px}
 .zs-team-member{min-width:0;overflow-wrap:anywhere;border:0;background:transparent}
 .zs-team-workspace .zs-team-person{display:flex;flex-direction:column;align-items:stretch;justify-content:center;gap:4px;box-sizing:border-box;width:100%;min-width:0;min-height:64px;margin:0;padding:10px;border:1px solid transparent;border-radius:6px;background:transparent;text-align:start;cursor:pointer}
 .zs-team-member-detail{padding:4px 10px 12px;font-size:11px;line-height:1.7;overflow-wrap:anywhere}
 .zs-team-member-detail p{margin:7px 0;white-space:pre-wrap}.zs-team-member-detail small{color:var(--zw-muted)}
 .zs-team-member-detail details{border-top:1px solid var(--zw-line);padding:8px 0}.zs-team-member-detail summary{cursor:pointer;overflow-wrap:anywhere}
 .zs-team-member-detail ul{padding-inline-start:18px}.zs-team-member-detail article{border-top:1px solid var(--zw-line);margin-top:8px;padding-top:8px}
 .zs-team-member-skeleton{padding:12px 10px;color:var(--zw-muted);font-size:11px}
 .zs-team-progress progress{width:100%;height:3px;accent-color:var(--zw-purple);display:block}.zs-team-progress progress::-webkit-progress-bar{background:var(--zw-line)}.zs-team-progress progress::-webkit-progress-value{background:var(--zw-purple)}
 .zs-team-last-report{white-space:pre-wrap;border-left:2px solid var(--zw-purple);padding-left:8px}
 .zs-team-messages{border-top:1px solid var(--zw-line);padding:12px 10px;margin-top:12px;font-size:11px;overflow-wrap:anywhere}.zs-team-messages summary{cursor:pointer}.zs-team-messages p{white-space:pre-wrap}
 .zs-team-handoff{padding:8px 14px;margin:0;flex:none;border-left:2px solid var(--zw-purple);font-size:11px;background:var(--zw-panel)}
 .zs-team-action-error{grid-column:1/-1;margin:0;padding:8px 12px}
 .zs-team-workspace button:not(.zs-team-main-conversation *):not(.zs-team-native-chat *),.zs-team-config button{font:inherit;font-size:11px;padding:6px 10px;border:1px solid var(--zw-line);border-radius:5px;color:var(--zw-ink);background:var(--zw-paper);cursor:pointer}
 .zs-team-workspace button:not(.zs-team-main-conversation *):not(.zs-team-native-chat *):hover,.zs-team-config button:hover{background:var(--zw-soft)}
 .zs-team-workspace button:not(.zs-team-main-conversation *):not(.zs-team-native-chat *):disabled,.zs-team-config button:disabled{opacity:.5;cursor:default}
 .zs-team-workspace .zs-team-roster .zs-team-person{border:0;background:transparent}
 .zs-team-workspace .zs-team-roster .zs-team-person[aria-pressed=true]{background:var(--zw-soft)}
 .zs-team-workspace button:not(.zs-team-main-conversation *):not(.zs-team-native-chat *):focus-visible{outline:2px solid var(--zw-purple);outline-offset:-2px}
 .zs-team-config{width:min(760px,calc(100vw - 32px))!important;max-width:760px!important}.zs-team-config-body{border:0;margin:0;padding:0 24px;overflow:auto;max-height:65vh;min-width:0}.zs-team-config-body section{padding:16px 0;border-bottom:1px solid var(--zw-line)}.zs-team-config-body h3{font-size:13px;font-weight:500;margin:0 0 10px}.zs-team-config-body label{font:inherit;font-size:12px;line-height:1.7;display:grid;gap:6px}.zs-team-config-body .zs-form-field{margin:12px 0}.zs-team-config-body .zw-row-actions{display:flex;align-items:center;gap:12px;margin:0}.zs-team-config-body .zw-row-actions label{display:flex;align-items:center;gap:6px;margin-left:auto}.zs-team-config-body :is(input:not([type=checkbox]),textarea,select){box-sizing:border-box;width:100%;min-width:0;border:1px solid var(--zw-line);border-radius:5px;padding:8px 10px;font:12px/1.7 var(--hud-mono,monospace);color:var(--zw-ink);background:var(--zw-paper)}.zs-team-config-body textarea{resize:vertical}.zs-team-route{display:grid;grid-template-columns:minmax(0,2fr) minmax(0,1fr);gap:12px;margin:12px 0}.zs-team-load-error{font-size:11px;color:var(--zw-muted);margin:4px 12px}
 html[data-ui-stronger-motion] .zs-team-member button{transition:background-color 140ms,border-color 140ms}
 @supports(appearance:base-select){
  .zs-team-config select,.zs-team-config select::picker(select){appearance:base-select}
  .zs-team-config select::picker(select){border:1px solid var(--zw-line);border-radius:6px;background:var(--zw-paper);color:var(--zw-ink);padding:4px;box-shadow:0 8px 24px #0002;max-height:min(360px,60vh);overflow:auto;font:12px/1.7 var(--hud-mono,monospace)}
  .zs-team-config select option{padding:8px 10px;min-height:34px;cursor:pointer}.zs-team-config select option:is(:checked,:hover){background:var(--zw-soft);color:var(--zw-ink)}.zs-team-config select optgroup{font-weight:400;color:var(--zw-muted)}
 }
 @media(max-width:640px){.zs-team-workspace{grid-template-columns:clamp(112px,28%,156px) minmax(0,1fr)}.zs-team-roster>header{flex-wrap:wrap;gap:4px;padding:8px}.zs-team-roster-scroll{padding:4px}.zs-team-person-line{flex-wrap:wrap}.zs-team-person-line>span{font-size:10px}.zs-team-route{grid-template-columns:1fr}.zs-team-config-body{padding:0 16px}}
 @media(prefers-reduced-motion:reduce){html[data-ui-stronger-motion] .zs-team-member{animation:none}html[data-ui-stronger-motion] .zs-team-member button{transition:none}}
 
.zs-team-workspace .zs-team-main-conversation[hidden]{display:none}
.zs-team-workspace .zs-team-roster .zs-team-person{display:grid;grid-template-columns:20px minmax(0,1fr) 6px;align-items:center;gap:10px;min-height:50px;padding:12px 14px;text-align:left}
.zs-team-workspace .zs-team-roster .zs-team-person strong{font-size:12px;font-weight:500;line-height:1.6;min-width:0;overflow-wrap:anywhere}
.zs-team-symbol{width:18px;height:18px;flex:0 0 18px;color:inherit;vertical-align:middle}
.zs-team-status-dot{display:block;width:5px;height:5px;border-radius:50%;background:var(--zw-muted);opacity:.45}
.zs-team-status-dot[data-state=running],.zs-team-status-dot[data-state=accepted]{background:var(--zw-purple);opacity:1}
.zs-team-status-dot[data-state=blocked],.zs-team-status-dot[data-state=failed],.zs-team-status-dot[data-state=error]{opacity:1;background:#a86976}
.zs-team-workspace .zs-team-detail-view{min-width:0;min-height:0;flex:1;overflow:auto;overscroll-behavior:contain;padding:24px 28px;box-sizing:border-box;color:var(--zw-ink)}
.zs-team-workspace .zs-team-detail-header{display:flex;align-items:center;gap:10px;border-bottom:1px solid var(--zw-line);padding:0 0 16px;margin-bottom:20px}
.zs-team-workspace .zs-team-detail-header h2{font-size:16px;font-weight:500;margin:0;line-height:1.6}
.zs-team-workspace .zs-team-detail-header small{margin-left:auto;color:var(--zw-muted)}
.zs-team-workspace .zs-team-detail-view .zs-team-member-detail{padding:0;max-width:960px;margin:0 auto}
.zs-team-workspace .zs-team-detail-view h3{font-size:13px;font-weight:500;margin:24px 0 10px}
.zs-team-workspace .zs-team-detail-view details{margin-top:16px}
.zs-preset-menu-name{display:block;text-align:left}
@media(max-width:640px){.zs-team-workspace .zs-team-roster .zs-team-person{grid-template-columns:16px minmax(0,1fr) 4px;gap:6px;padding:12px 9px}.zs-team-workspace .zs-team-detail-view{padding:20px 16px}}
.zs-team-native-root:has(.zs-team-member-view:not([hidden]))>.an3WzG_body{visibility:hidden;pointer-events:none}
.zs-team-portal .zs-team-member-view{pointer-events:auto;display:flex;flex-direction:column;flex:1;min-width:0;min-height:0;height:100%;overflow:hidden;box-sizing:border-box;background:var(--zw-paper)}
.zs-team-chat-header{display:flex;align-items:center;gap:12px;flex:none;min-height:48px;padding:8px 20px;border-bottom:1px solid var(--zw-line);box-sizing:border-box}
.zs-team-chat-header strong{font-size:13px;font-weight:500;min-width:0;overflow-wrap:anywhere}
.zs-team-chat-header nav{display:flex;gap:4px;margin-inline-start:auto}
.zs-team-chat-header nav button[aria-pressed=true]{background:var(--zw-soft);border-color:var(--zw-purple)}
.zs-team-native-chat{display:flex;flex:1;min-width:0;min-height:0;overflow:hidden}
.zs-team-native-chat>.an3WzG_body{flex:1;min-width:0;min-height:0;margin:0}
html[data-ui-stronger] .zs-team-native-chat .an3WzG_body[data-content-phase=active] .an3WzG_composerSeat{flex:none!important;min-height:0!important}
.zs-team-native-chat .an3WzG_viewArea{flex:1;min-height:0}
.zs-team-chat-loading,.zs-team-chat-error{padding:20px}
.zs-team-new-chat{display:flex;flex-direction:column;flex:1;min-width:0;min-height:0;padding:16px clamp(16px,5%,64px) 22px;box-sizing:border-box}
.zs-team-new-chat-space{display:flex;flex-direction:column;align-items:center;justify-content:center;flex:1;min-height:80px;color:var(--zw-muted);gap:8px}
.zs-team-new-chat-space p{font-size:20px;font-weight:400;margin:0}.zs-team-new-chat-space small{font-size:12px;max-width:420px;text-align:center;overflow-wrap:anywhere}
.zs-team-workspace .zs-team-member-composer{display:flex;flex-direction:column;flex:none;gap:8px;width:100%;max-width:none;margin:16px 0 0;padding:12px 16px 8px;border:1px solid var(--zw-line);border-radius:14px;background:var(--zw-paper);box-shadow:0 3px 12px #00000004}
.zs-team-workspace .zs-team-member-composer textarea{min-height:70px;margin:0;padding:4px 0;border:0;background:transparent;font:14px/26px var(--ds-font-family-base,system-ui);outline:none;box-shadow:none;resize:vertical}
.zs-team-member-composer .zs-team-member-controls{display:flex;justify-content:flex-end;align-items:center;gap:12px;margin:0;padding:8px 0 0;border-top:1px solid var(--zw-line)}
.zs-team-member-composer .zs-team-member-controls small{font-size:11px;color:var(--zw-muted)}
.zs-team-workspace .zs-team-member-composer button.zs-team-member-send{display:flex;align-items:center;justify-content:center;width:30px;height:30px;padding:6px;background:var(--zw-ink);color:var(--zw-paper);border:0;border-radius:8px}
.zs-team-member-composer button svg{width:18px;height:18px;transform:rotate(-90deg)}
.zs-team-lead-section{border-bottom:1px solid var(--zw-line);padding-bottom:10px;margin-bottom:8px}
.zs-team-section-label{display:block;color:var(--zw-muted);font-size:10px;line-height:18px;font-weight:400;padding:8px 10px}
.zs-team-section-header{display:flex;align-items:center;justify-content:space-between}
.zs-team-member-row{display:flex;align-items:center;min-width:0;gap:0}
.zs-team-roster .zs-team-member-row>.zs-team-person{flex:1;width:0;min-width:0;padding-inline:8px;gap:8px}
.zs-team-row-menu{flex:none;display:flex;align-items:center}
.zs-team-workspace .zs-team-member-more{display:inline-flex;align-items:center;justify-content:center;flex:none;width:26px;height:30px;padding:4px;border:0;background:transparent;line-height:1;color:var(--zw-muted)}
.zs-team-workspace .zs-team-member-more:hover{background:var(--zw-soft);color:var(--zw-ink)}
.zs-team-member-menu{font-size:12px}
.zs-team-workspace .zs-team-roster button.zs-team-person{border:0;background:transparent;color:var(--zw-ink);font-family:inherit}
.zs-team-workspace .zs-team-roster button.zs-team-person[aria-pressed=true]{background:var(--zw-soft)}
.zs-team-workspace .zs-team-roster button.zs-team-member-more{box-sizing:border-box;padding:4px;border:0;background:transparent;color:var(--zw-muted)}
.zs-team-workspace .zs-team-roster button.zs-team-member-more:hover{background:var(--zw-soft);color:var(--zw-ink)}
.zs-team-workspace .zs-team-member-more svg{width:18px!important;height:18px!important;fill:currentColor!important;stroke:none!important;opacity:1}
@media(max-width:560px){.zs-team-roster .zs-team-member-row>.zs-team-person{grid-template-columns:minmax(0,1fr) 4px;padding-inline:5px;gap:4px}.zs-team-roster .zs-team-person .zs-team-symbol{display:none}.zs-team-workspace .zs-team-member-more{width:23px}.zs-team-chat-header{padding-inline:12px}.zs-team-portal .zs-team-roster>header{flex-wrap:wrap}}

.zs-team-workspace form.zs-team-member-composer{display:flex;flex-direction:column;grid-template:none;align-items:stretch;width:100%;min-width:0;height:auto;box-sizing:border-box}
.zs-team-workspace .zs-team-member-composer>.zs-team-member-input{display:block;box-sizing:border-box;width:100%;min-width:0;min-height:70px;max-height:240px;flex:0 0 auto;float:none}
.zs-team-workspace .zs-team-member-composer>.zs-team-member-controls{display:flex;flex-direction:row;align-items:center;justify-content:flex-end;flex:0 0 auto;box-sizing:border-box;width:100%;min-width:0;gap:12px;float:none}
.zs-team-workspace .zs-team-member-controls>.zs-team-member-model{display:block;flex:0 1 auto;min-width:0;max-width:calc(100% - 42px);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;word-break:normal;line-height:20px}
.zs-team-coordinator,.zs-team-member-view{position:relative}
.zs-team-member-view[hidden]{display:flex!important;position:absolute!important;inset:0;visibility:hidden;pointer-events:none}
.zs-team-chat-pane[hidden]{display:flex!important;position:absolute!important;inset:48px 0 0;visibility:hidden;pointer-events:none}
.zs-team-chat-pane{display:flex;flex:1;min-height:0;min-width:0;overflow:hidden}
.zs-team-workspace .zs-team-roster .zs-team-person{grid-template-columns:18px minmax(0,1fr) auto}
.zs-team-workspace .zs-team-roster .zs-team-person strong{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.zs-team-agent-status{display:inline-flex;align-items:center;justify-content:flex-end;gap:4px;font:10px/18px var(--hud-mono,monospace);white-space:nowrap;color:var(--zw-muted)}
.zs-team-agent-status i{width:5px;height:5px;border-radius:50%;background:currentColor;flex:none}
.zs-team-agent-status[data-state=running],.zs-team-agent-status[data-state=reviewing]{color:var(--zw-deep)}
.zs-team-agent-status[data-state=approval],.zs-team-agent-status[data-state=blocked],.zs-team-agent-status[data-state=error]{color:#a96974}
/* An empty running child has one Stop control. Queue/send stays available for a real draft. */
.zs-team-native-root .GRgSLq_trailing:has(button.GRgSLq_primary svg rect) button.GRgSLq_primary:disabled:has(svg path){display:none}
.zs-team-native-root .GRgSLq_trailing:has(button.GRgSLq_primary:not(:disabled) svg path) button.GRgSLq_primary:has(svg rect){display:none}
@media(max-width:560px){.zs-team-roster .zs-team-member-row>button.zs-team-person{grid-template-columns:minmax(0,1fr) auto;gap:4px}.zs-team-agent-status{font-size:9px;gap:3px}.zs-team-agent-status i{width:4px;height:4px}}
.zs-team-workspace .zs-team-member-controls>button.zs-team-member-send{display:inline-flex;flex:0 0 30px;align-items:center;justify-content:center;box-sizing:border-box;width:30px;height:30px;min-width:30px;padding:6px;line-height:1}

`;

 function PersonaPolicy({data,busy,onSave}){
  const saved=data.personaPolicy??{openness:'fixed',evolve:false,initiative:false};
  const key=JSON.stringify([data.activePersona,saved]),[policy,setPolicy]=React.useState(saved);
  React.useEffect(()=>setPolicy(saved),[key]);
  if(!data.activePersona)return null;
  const update=next=>{if(busy)return;const prior=policy;setPolicy(next);Promise.resolve(onSave(next)).then(result=>{if(!result)setPolicy(prior);}).catch(()=>setPolicy(prior));};
  return h('fieldset',{className:'zs-feature-form',disabled:busy},h('legend',null,'人设开放度'),
   h('label',null,'表达范围',h('select',{'aria-label':'人设开放度',value:policy.openness,onChange:event=>update({...policy,openness:event.target.value})},h('option',{value:'fixed'},'固定人设'),h('option',{value:'expression'},'允许自然调整表达'),h('option',{value:'preferences'},'允许角色化偏好'))),
   h('label',null,h('input',{type:'checkbox',checked:policy.evolve,onChange:event=>update({...policy,evolve:event.target.checked})}),'允许本会话中轻微变化'),
   h('label',null,h('input',{type:'checkbox',checked:policy.initiative,onChange:event=>update({...policy,initiative:event.target.checked})}),'允许当前任务范围内的低风险主动行为'),
   h('small',null,'默认关闭。永久修改需本人确认，角色偏好不作为真实经历或执行授权。'));
 }
 function SessionTasksPanel({control,sessionId}){
  const [data,setData]=React.useState(null),[title,setTitle]=React.useState(''),[prompt,setPrompt]=React.useState(''),[at,setAt]=React.useState(()=>{const date=new Date(Date.now()+3600000);return date.getFullYear()+'-'+String(date.getMonth()+1).padStart(2,'0')+'-'+String(date.getDate()).padStart(2,'0')+'T'+String(date.getHours()).padStart(2,'0')+':'+String(date.getMinutes()).padStart(2,'0');}),[error,setError]=React.useState(''),[busy,setBusy]=React.useState(false),[version,setVersion]=React.useState(0);
  React.useEffect(()=>{let active=true;const controller=new AbortController();setData(null);const refresh=()=>control('sessionTasks',{sessionId},controller.signal).then(value=>{if(active)setData(value);}).catch(error=>{if(active&&!controller.signal.aborted)setError(error.message);});if(sessionId)void refresh();const timer=setInterval(()=>{if(sessionId&&!document.hidden)void refresh();},5000);return()=>{active=false;controller.abort();clearInterval(timer);};},[control,sessionId,version]);
  const run=async(action,payload)=>{if(busy)return;setBusy(true);setError('');try{await control(action,{sessionId,...payload});setVersion(value=>value+1);}catch(error){setError(error.message);}finally{setBusy(false);}};
  return h('section',{className:'zw-panel zs-feature-form'},h('h2',null,'当前会话定时'),!sessionId?h('p',null,'请先打开一个会话。'):h(React.Fragment,null,
   h('p',null,data?.policy??'任务在本会话执行，关闭期间错过的任务等待本人确认。'),
   h('form',{onSubmit:event=>{event.preventDefault();const date=new Date(at);if(!Number.isFinite(date.getTime())){setError('请选择有效时间');return;}void run('createSessionTask',{task:{title,prompt,at:date.toISOString()}});}},h('fieldset',{disabled:busy||!data?.available},h('label',null,'任务标题',h('input',{required:true,maxLength:100,value:title,onChange:event=>setTitle(event.target.value)})),h('label',null,'执行时间 · '+Intl.DateTimeFormat().resolvedOptions().timeZone,h('input',{required:true,type:'datetime-local',value:at,onChange:event=>setAt(event.target.value)})),h('label',null,'要做的事',h('textarea',{required:true,maxLength:4000,value:prompt,rows:3,onChange:event=>setPrompt(event.target.value)})),h('button',{type:'submit'},'保存定时任务'))),
   data&&!data.available?h('p',{role:'status'},'DSH 原生定时服务尚未启用。'):null,
   ...(data?.tasks??[]).map(task=>h('article',{key:task.id,className:'zs-feature-record'},h('strong',null,task.title),h('small',null,new Date(task.at).toLocaleString()+' · '+({waiting:'等待执行',missed:'已错过 · 等待确认',dispatching:'提交中',delivered:'已提交 DSH',failed:'需要核对',cancelled:'已取消'}[task.status]??task.status)),h('p',null,task.prompt),task.nativeId?h('small',null,'原生任务 '+task.nativeId+' · 可在 DSH 自动化任务中查看'):null,task.error?h('p',{role:'alert'},task.error):null,h('div',{className:'zw-row-actions'},['missed','failed'].includes(task.status)?h('button',{disabled:busy,onClick:()=>void run('sessionTaskAction',{id:task.id,action:'run'})},'确认补跑'):null,task.status==='waiting'?h('button',{disabled:busy,onClick:()=>void run('sessionTaskAction',{id:task.id,action:'cancel'})},'取消'):null,task.status!=='dispatching'?h('button',{disabled:busy,onClick:()=>void run('sessionTaskAction',{id:task.id,action:'remove'})},'移除记录'):null))),
   !data?.tasks.length?h('small',null,'当前会话还没有定时任务。'):null),error?h('p',{className:'zw-error',role:'alert'},error):null);
 }
 function MemoryPoolsPanel({control}){
  const [data,setData]=React.useState(null),[pools,setPools]=React.useState([]),[error,setError]=React.useState(''),[busy,setBusy]=React.useState(false),[notice,setNotice]=React.useState(''),[version,setVersion]=React.useState(0);
  React.useEffect(()=>{let active=true;control('memoryPools').then(value=>{if(active){setData(value);setPools(value.pools);}}).catch(error=>{if(active)setError(error.message);});return()=>{active=false;};},[control,version]);
  const patch=(id,change)=>{setNotice('');setPools(old=>old.map(pool=>pool.id===id?{...pool,...change}:pool));};
  const toggle=(pool,key,value,checked)=>patch(pool.id,{[key]:checked?[...pool[key],value]:pool[key].filter(item=>item!==value)});
  const save=async()=>{if(busy||!data)return;setBusy(true);setError('');try{await control('configureMemoryPools',{revision:data.revision,pools});const next=await control('memoryPools');setData(next);setPools(next.pools);setNotice('共享记忆范围已保存');}catch(error){setError(error.message);}finally{setBusy(false);}};
  return h('details',{className:'zs-feature-form'},h('summary',null,'会话与工作区共享记忆'),h('p',null,'每份记忆可包含多个会话或整个工作区。工作区中新建的会话自动加入。未标记来源的旧记忆默认保留在组外，可单独开启纳入。跨微信范围仍受微信授权控制，既有会话使用冻结快照，新事实按需召回。'),!data?h('p',null,error||'正在读取可选会话…'):h(React.Fragment,null,
   ...pools.map(pool=>h('fieldset',{key:pool.id,disabled:busy},h('label',null,'记忆名称',h('input',{value:pool.name,maxLength:80,onChange:event=>patch(pool.id,{name:event.target.value})})),h('details',null,h('summary',null,'选择整个工作区'),...data.folders.map(folder=>h('label',{key:folder.cwd},h('input',{type:'checkbox',checked:pool.cwds.includes(folder.cwd),onChange:event=>toggle(pool,'cwds',folder.cwd,event.target.checked)}),folder.label))),h('details',null,h('summary',null,'选择单独会话'),...data.sessions.map(session=>h('label',{key:session.id},h('input',{type:'checkbox',checked:pool.sessionIds.includes(session.id),onChange:event=>toggle(pool,'sessionIds',session.id,event.target.checked)}),(session.channel==='wechat'?'微信 · ':'')+session.title))),h('label',null,h('input',{type:'checkbox',checked:pool.includeGlobal===true,onChange:event=>patch(pool.id,{includeGlobal:event.target.checked})}),'同时使用旧的全局记忆'),h('button',{type:'button',onClick:()=>setPools(old=>old.filter(item=>item.id!==pool.id))},'移除此共享范围'))),
   h('div',{className:'zw-row-actions'},h('button',{type:'button',disabled:busy||pools.length>=16,onClick:()=>setPools(old=>[...old,{id:'memory-'+crypto.randomUUID(),name:'共享记忆',sessionIds:[],cwds:[],includeGlobal:false}])},'新增共享记忆'),h('button',{type:'button',disabled:busy,onClick:()=>void save()},'保存共享范围'))),h('button',{type:'button',disabled:busy,onClick:()=>setVersion(value=>value+1)},'重新读取共享范围'),notice?h('p',{role:'status'},notice):null,error?h('p',{className:'zw-error',role:'alert'},error):null);
 }
 function EvidencePanel({control,sessionId}){
  const [config,setConfig]=React.useState(null),[catalog,setCatalog]=React.useState(null),[route,setRoute]=React.useState(''),[images,setImages]=React.useState([]),[result,setResult]=React.useState(null),[error,setError]=React.useState(''),[busy,setBusy]=React.useState(false);
  const currentSession=React.useRef(sessionId),mounted=React.useRef(true);currentSession.current=sessionId;
  React.useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;};},[]);
  React.useEffect(()=>{let active=true;Promise.all([control('evidenceSettings'),control('modelCatalog')]).then(([settings,models])=>{if(active){setConfig(settings);setRoute(settings.ocr?JSON.stringify(settings.ocr):'');setCatalog(models);}}).catch(error=>{if(active)setError(error.message);});return()=>{active=false;};},[control]);
  React.useEffect(()=>{setImages([]);setResult(null);setError('');},[sessionId]);
  const load=async files=>{const owner=sessionId;try{const selected=[...files].filter(file=>/^image\/(png|jpeg|webp)$/.test(file.type));if(!selected.length||selected.length>4||selected.reduce((sum,file)=>sum+file.size,0)>8000000)throw Error('支持1至4张PNG/JPG/WebP，总大小8MB以内');const values=await Promise.all(selected.map(file=>new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve({mediaType:file.type,data:String(reader.result).split(',')[1]});reader.onerror=()=>reject(Error('图片读取失败'));reader.readAsDataURL(file);})));if(!mounted.current||currentSession.current!==owner)return;setImages(values);setResult(null);setError('');}catch(error){setError(error.message);}};
  const run=async(action,payload)=>{if(busy)return;const owner=sessionId;setBusy(true);setError('');try{const value=await control(action,payload);if(!mounted.current||currentSession.current!==owner)return;if(action==='configureEvidence')setConfig(value);else setResult(value);}catch(error){if(mounted.current&&currentSession.current===owner)setError(error.message);}finally{if(mounted.current)setBusy(false);}};
  return h('section',{className:'zw-panel zs-feature-form'},h('h2',null,'网页与 OCR'),h('p',null,'网页侧栏保留 DSH 原生浏览、文件、终端与诊断能力。打开网页后，可按需读取公开原文证据。OCR 使用你已配置的图片模型，为纯文本主模型提取文字。'),
   h('fieldset',{disabled:busy||!config},h('label',null,'OCR 模型',h('select',{'aria-label':'OCR模型',value:route,onChange:event=>setRoute(event.target.value)},h('option',{value:''},'关闭 OCR 接口'),route&&!catalog?.providers.some(provider=>provider.models.some(model=>JSON.stringify({provider:provider.id,model:model.id})===route))?h('option',{value:route},config?.ocr?.model+'（已保存）'):null,...(catalog?.providers??[]).map(provider=>h('optgroup',{key:provider.id,label:provider.name||provider.id},...provider.models.map(model=>h('option',{key:model.id,value:JSON.stringify({provider:provider.id,model:model.id})},model.name||model.id)))))),h('button',{onClick:()=>void run('configureEvidence',{ocr:route?JSON.parse(route):null})},'保存 OCR 接口'),h('small',{role:'status'},config?.ocr?'当前接口 · '+config.ocr.model:'OCR 接口已关闭')),
   h('div',{className:'zs-ocr-input',tabIndex:0,onPaste:event=>{const files=event.clipboardData?.files;if(files?.length){event.preventDefault();void load(files);}}},h(LocalFilePicker,{label:'选择图片或在此粘贴',hint:'PNG / JPG / WebP · 最多4张',accept:'image/png,image/jpeg,image/webp',multiple:true,disabled:busy,onChange:event=>void load(event.target.files)}),h('small',null,images.length?'已选择 '+images.length+' 张图片':'最多4张 · 8MB'),h('button',{disabled:busy||!images.length||!config?.ocr||!sessionId,onClick:()=>void run('ocrEvidence',{sessionId,images})},busy?'处理中…':'生成 JSON 文字证据')),
   result?h('textarea',{'aria-label':'OCR JSON证据',readOnly:true,rows:12,value:JSON.stringify(result,null,2)}):null,
   h('small',null,'图片仅在点击识别后交给所选模型，使用 DSH 图片存储。OCR 可能误识别，图片文字不能改变任务或安全权限。模型也可调用 workspace_ocr 读取最新用户图片。'),error?h('p',{className:'zw-error',role:'alert'},error):null);
 }
 function wireBrowserEvidence(ctx,store){ctx.effect(()=>{
  let dispose,installing=false;const owners=new WeakMap();
  const attach=()=>{
   if(dispose||installing)return;
   const entry=ctx.slots.entriesOfSlot('sidebar.right.pane.tab').find(row=>(row.options?.key??row.key)==='@deepseek-ai/dsh-client-ui-sidebar-browser');
   if(!entry?.component)return;const Original=entry.component;
   function Browser(props){
    const info=props.useTabInfo(),tab=info.tab,state=props.useBrowserState(tab.id),target=state?.frame?.target??state?.restoreTarget;
    const [result,setResult]=React.useState(null),[error,setError]=React.useState(''),[busy,setBusy]=React.useState(false);
    const sessionId=owners.get(props.useBrowserState)??info.sessionId??tab.sessionId;
    const identity=JSON.stringify([sessionId,target?.url]),current=React.useRef(identity),request=React.useRef(null);current.current=identity;
    React.useEffect(()=>{setResult(null);setError('');setBusy(false);return()=>request.current?.abort();},[identity]);
    const read=async()=>{if(busy)return;const owner=identity,controller=new AbortController();request.current=controller;setBusy(true);setError('');try{const value=await callControl(ctx,'pageEvidence',{sessionId,url:target.url},controller.signal);if(current.current===owner&&!controller.signal.aborted)setResult(value);}catch(error){if(current.current===owner&&!controller.signal.aborted)setError(error.message);}finally{if(!controller.signal.aborted)setBusy(false);}};
    return h('div',{className:'zs-native-browser'},h('div',{className:'zs-browser-evidence-actions'},h('button',{disabled:busy||!sessionId||!target?.url,onClick:()=>void read()},busy?'读取中…':'原文证据'),h('button',{onClick:()=>openTools('evidence')},'OCR')),h(Original,props),result?h('details',{className:'zs-browser-evidence',open:true},h('summary',null,'网页 JSON 证据'),h('textarea',{'aria-label':'网页JSON证据',readOnly:true,rows:8,value:JSON.stringify(result,null,2)}),h('small',null,result.note)):null,error?h('p',{className:'zw-error',role:'alert'},error):null);
   }
   const nativeInject=entry.inject??entry.options.inject;
   const inject=typeof nativeInject==='function'?function(sessionId,...args){const value=nativeInject.call(this,sessionId,...args);if(typeof value?.useBrowserState==='function')owners.set(value.useBrowserState,sessionId);return value;}:nativeInject;
   installing=true;try{dispose=ctx.slots.register({...entry.options,name:'sidebar.right.pane.tab',key:'@deepseek-ai/dsh-client-ui-sidebar-browser',inject,locale:entry.locale??entry.options.locale,...entry.store?{store:entry.store}:{},priority:Math.min(-100,(entry.options.priority??0)-1)},Browser);}finally{installing=false;}
  };
  const off=ctx.slots.subscribe('sidebar.right.pane.tab',attach);attach();return()=>{off();dispose?.();};
 },'ui-stronger: native browser evidence');}
 const SESSION_FEATURE_CSS=`
 .zs-feature-form{font:12px/1.7 var(--hud-mono,ui-monospace,monospace);min-width:0}.zs-feature-form fieldset{border:1px solid var(--zw-line);border-radius:6px;padding:14px;margin:14px 0;min-width:0}.zs-feature-form legend{padding:0 6px}.zs-feature-form label{display:flex;align-items:center;gap:8px;margin:10px 0;flex-wrap:wrap}.zs-feature-form label:has(>input:not([type=checkbox]),>select,>textarea){display:grid;gap:6px}.zs-feature-form :is(input:not([type=checkbox]),select,textarea){box-sizing:border-box;max-width:100%;width:100%;padding:8px 10px;border:1px solid var(--zw-line);border-radius:6px;background:var(--zw-paper);color:var(--zw-ink);font:inherit}.zs-feature-form button,.zs-browser-evidence-actions button{font:inherit;border:1px solid var(--zw-line);background:var(--zw-paper);color:var(--zw-ink);border-radius:5px;padding:6px 10px;cursor:pointer}.zs-feature-form :disabled,.zs-browser-evidence-actions :disabled{opacity:.5;cursor:default}.zs-feature-record{padding:14px 0;border-top:1px solid var(--zw-line)}.zs-feature-record small{display:block}.zs-feature-record p{white-space:pre-wrap;overflow-wrap:anywhere}.zs-ocr-input{padding:16px;border:1px dashed var(--zw-line);margin:16px 0}.zs-native-browser{display:flex;flex-direction:column;flex:1;min-width:0;min-height:0;height:100%}.zs-native-browser>div:not(.zs-browser-evidence-actions){flex:1;min-height:0}.zs-browser-evidence-actions{display:flex;justify-content:flex-end;gap:6px;padding:6px 10px;border-bottom:1px solid var(--zw-line);font:11px/1.5 var(--hud-mono,monospace);flex:none}.zs-browser-evidence{max-height:40vh;overflow:auto;padding:10px;flex:none;font-size:11px}.zs-browser-evidence textarea{width:100%;box-sizing:border-box;font:11px/1.6 var(--hud-mono,monospace);color:var(--zw-ink);background:var(--zw-paper);border:1px solid var(--zw-line)}
 `;

 function Tools({store,control,navigation}){
  const s=useState(store),[tab,setTab]=React.useState(null),[dirty,setDirty]=React.useState(false),lastTab=React.useRef('interface'),unsaved=React.useRef(false);unsaved.current=dirty;
  React.useEffect(()=>{const open=e=>{if(unsaved.current)return;const requested=e.detail||lastTab.current;if(requested==='models'){try{navigation.models();}catch(err){store.error(err.message);}return;}const next=requested==='start'?'interface':requested;lastTab.current=next;setTab(next);};const dismiss=()=>{if(!unsaved.current)setTab(null);};window.addEventListener('ui-stronger-tools',open);window.addEventListener('ui-stronger-dismiss',dismiss);return ()=>{window.removeEventListener('ui-stronger-tools',open);window.removeEventListener('ui-stronger-dismiss',dismiss);};},[navigation,store]);
  if(!tab)return null;
  const groups=[['使用',[['thinking','思考工作台'],['bots','智能体协作'],['process','过程与依据'],['schedule','会话定时']]],['偏好',[['interface','界面'],['background','背景'],['modules','工作模块'],['voice','语音'],['pet','桌宠']]],['资料',[['memory','记忆'],['knowledge','知识库'],['persona','人设']]],['能力',[['skills','技能'],['history','跨会话'],['context','上下文与模型'],['safety','安全'],['evidence','网页与 OCR']]],['连接',[['workspaces','工作区'],['wechat','微信']]]];
  return h(FocusSurface,{label:'扩展',canClose:!dirty,onClose:()=>setTab(null),className:'zs-tools zs-quiet-tools'},h('header',{className:'zs-surface-header'},h('label',{className:'zs-section-select'},h('span',null,'扩展'),h('select',{'aria-label':'扩展页面',disabled:dirty,value:tab,onChange:e=>{lastTab.current=e.target.value;setTab(e.target.value);}},...groups.map(([label,rows])=>h('optgroup',{key:label,label},...rows.map(([id,title])=>h('option',{key:id,value:id},title)))))),h('button',{className:'zs-icon-button',title:dirty?'请先保存或放弃修改':'关闭扩展','aria-label':'关闭扩展',disabled:dirty,'data-surface-close':true},h(NavIcon,{kind:'close'}))),h('div',{key:tab,className:'zs-page-transition'},tab==='schedule'?h(SessionTasksPanel,{control,sessionId:s.sessionId}):tab==='evidence'?h(EvidencePanel,{control,sessionId:s.sessionId}):tab==='bots'?h(BotsPanel,{store,control}):tab==='thinking'?h(ThinkingPanel,{store,control,navigation,onDirty:setDirty}):tab==='models'?h(NativeModelsPanel,{store,control,navigation}):WORKBENCH_TABS.some(x=>x[0]===tab)?h(WorkbenchPanel,{store,control,navigation,tab}):CAPABILITY_TABS.some(x=>x[0]===tab)?h(WorkspacePanel,{control,tab,store}):h(Settings,{store,control,tab})));
 }
 function Palette({store,navigation}){
  const s=useState(store),panels=useCatalog(navigation),[open,setOpen]=React.useState(false),[query,setQuery]=React.useState(''),[index,setIndex]=React.useState(0);
  React.useEffect(()=>{const show=()=>{setQuery('');setIndex(0);setOpen(true);};const key=e=>{if(!e.defaultPrevented&&!e.isComposing&&!e.altKey&&(e.ctrlKey||e.metaKey)&&e.shiftKey&&e.code==='KeyK'&&!document.querySelector('[role=dialog][aria-modal=true]')){e.preventDefault();show();}};window.addEventListener('ui-stronger-palette',show);window.addEventListener('keydown',key);return ()=>{window.removeEventListener('ui-stronger-palette',show);window.removeEventListener('keydown',key);};},[s.preferences.enabled]);
  if(!open)return null;
  const commands=uniqueCommands([{id:'models',label:'模型与供应商设置',detail:'DSH 原生配置',run:()=>{try{navigation.models();}catch(e){store.error(e.message);openTools('models');}}},{id:'conversation',label:'返回当前对话',detail:'继续当前任务',run:()=>navigation.select(null)},{id:'new',label:'新建会话',detail:'开始新的任务',run:navigation.start},...panels.map(p=>({...p,detail:'DSH 原生功能',run:()=>navigation.select(p.id)})),...[['interface','界面与动效'],['voice','接入本地语音'],['pet','接入桌宠'],['thinking','思考工作台'],...CAPABILITY_TABS,...WORKBENCH_TABS].map(([id,label])=>({id,label,detail:'界面与扩展',run:()=>openTools(id)}))]).filter(c=>!c.disabled&&c.label.toLowerCase().includes(query.trim().toLowerCase()));
  const choose=c=>{setOpen(false);window.setTimeout(c.run,0);};
  return h(FocusSurface,{label:'快速操作',onClose:()=>setOpen(false),className:'zs-palette'},h('header',null,h(NavIcon,{kind:'search'}),h('input',{placeholder:'搜索功能与入口…',value:query,'aria-label':'搜索操作','aria-controls':'zs-command-results','aria-activedescendant':commands.length?'zs-command-'+Math.min(index,commands.length-1):undefined,role:'combobox','aria-expanded':true,onChange:e=>{setQuery(e.target.value);setIndex(0);},onKeyDown:e=>{if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();setIndex(i=>(i+(e.key==='ArrowDown'?1:-1)+commands.length)%Math.max(1,commands.length));}if(e.key==='Enter'&&commands.length){e.preventDefault();choose(commands[Math.min(index,commands.length-1)]);}}}),h('button',{'data-surface-close':true,'aria-label':'关闭快速操作'},'Esc')),h('div',{className:'zs-command-results',id:'zs-command-results',role:'listbox'},...commands.map((c,i)=>h('button',{key:c.id,id:'zs-command-'+i,role:'option','aria-selected':i===Math.min(index,commands.length-1),onClick:()=>choose(c)},h('span',null,c.label),h('small',null,c.detail),h(NavIcon,{kind:'arrow'}))),commands.length?null:h('p',null,'没有匹配的操作')),h('footer',null,'↑ ↓ 选择　Enter 打开',h('span',null,'Ctrl Shift K')));
 }
 function wireDraftRows(ctx){
  const drafts=new Set(),listeners=new Set();let revision=0;
  const update=(id,present)=>{if(!id||drafts.has(id)===present)return;if(present)drafts.add(id);else drafts.delete(id);while(drafts.size>128)drafts.delete(drafts.values().next().value);revision++;listeners.forEach(listener=>listener());};
  function DraftTracker(props){
   const input=props.useInput(value=>value),blank=props.useSession(value=>value?.blank);
   const present=blank===true&&!!(input?.draft?.trim()||input?.attachmentIds?.length);
   React.useEffect(()=>update(props.sessionId,present),[props.sessionId,present]);return null;
  }
  ctx.effect(()=>ctx.slots.inject('conversation.input.left',()=>ctx.slots.register({name:'conversation.input.left',id:'ui-stronger-draft-tracker',order:1000},DraftTracker)));
  ctx.effect(()=>{
   let dispose;const attach=()=>{
    if(dispose)return;const entry=ctx.slots.entriesOfSlot('sidebar.workspaces')[0];if(!entry?.component)return;
    const Original=entry.component;let previous,cached,cachedRevision=-1;
    const project=value=>{
     if(value===previous&&cachedRevision===revision)return cached;
     previous=value;cachedRevision=revision;
     if(!value?.byId)return cached=value;
     const byId={...value.byId};for(const id of drafts)if(byId[id]?.blank)byId[id]={...byId[id],blank:false,title:'未发送草稿'};
     return cached={...value,byId};
    };
    function DraftBrowser(props){
     const [,refresh]=React.useReducer(value=>value+1,0);
     React.useEffect(()=>{listeners.add(refresh);return()=>listeners.delete(refresh);},[]);
     return h(Original,{...props,useSessions:select=>props.useSessions(value=>select(project(value)))});
    }
    dispose=ctx.slots.register({...entry.options,name:'sidebar.workspaces',inject:entry.inject??entry.options.inject,locale:entry.locale??entry.options.locale,...entry.store?{store:entry.store}:{},priority:Math.min(-100,(entry.options.priority??0)-1)},DraftBrowser);
   };const off=ctx.slots.subscribe('sidebar.workspaces',attach);attach();return()=>{off();dispose?.();drafts.clear();listeners.clear();};
  });
 }
 function wireReadingPosition(ctx){ctx.effect(()=>{
  const saved=new Map();let frame;
  const keyFor=element=>{
   const child=element.closest('[data-team-child]'),root=element.closest('.an3WzG_root');
   const id=child?.getAttribute('data-team-child')??root?.querySelector('[data-conversation-session]')?.getAttribute('data-conversation-session');
   return id?id+'|'+element.className:null;
  };
  const remember=event=>{
   const element=event.target;if(!(element instanceof Element)||element.clientHeight===0||element.scrollHeight<=element.clientHeight)return;
   if(!element.closest('.an3WzG_viewArea,.zs-team-native-chat'))return;
   const key=keyFor(element);if(!key)return;
   const prior=saved.get(key),human=Date.now()-(element.__zsReadingIntent??0)<1200;
   const delta=element.scrollTop-(prior?.top??element.scrollTop),direction=element.__zsReadingDirection;
   const unexpectedWheel=human&&direction&&((direction<0&&delta>4)||(direction>0&&delta< -4)||Math.abs(delta)>(element.__zsReadingStep??Infinity));
   if(prior?.reading&&(!human||unexpectedWheel)&&Math.abs(delta)>4){element.scrollTop=prior.top;return;}
   saved.set(key,{top:element.scrollTop,reading:element.scrollHeight-element.clientHeight-element.scrollTop>80});
   while(saved.size>128)saved.delete(saved.keys().next().value);
  };
  const intent=event=>{let element=event.target;while(element instanceof Element){element.__zsReadingIntent=Date.now();element.__zsReadingDirection=event.type==='wheel'?Math.sign(event.deltaY):0;element.__zsReadingStep=Math.max(element.clientHeight*2,Math.abs(event.deltaY??0)*3);element=element.parentElement;}};
  const restore=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{
   for(const element of document.querySelectorAll('.an3WzG_viewArea,.an3WzG_viewArea > *,[class*="_scroller"],[class*="_scroll"]')){
    if(!element.clientHeight||element.scrollHeight<=element.clientHeight)continue;const key=keyFor(element),position=saved.get(key);
    if(position?.reading&&Math.abs(element.scrollTop-position.top)>4)element.scrollTop=position.top;
   }
  });};
  document.addEventListener('scroll',remember,true);document.addEventListener('wheel',intent,{passive:true,capture:true});document.addEventListener('keydown',intent,true);document.addEventListener('pointerdown',intent,true);
  const observer=new MutationObserver(restore);observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['data-conversation-session','hidden']});
  return()=>{observer.disconnect();cancelAnimationFrame(frame);document.removeEventListener('scroll',remember,true);document.removeEventListener('wheel',intent,true);document.removeEventListener('keydown',intent,true);document.removeEventListener('pointerdown',intent,true);saved.clear();};
 });}

 function navigationFor(ctx){
  const listeners=new Set();let snapshot=[];
  const sync=()=>{snapshot=ctx.slots.entriesOfSlot('sidebar.panellist').map(({options})=>({id:options.id,label:typeof options.label==='function'?options.label():options.label||options.id,order:options.order||0})).sort((a,b)=>a.order-b.order);listeners.forEach(f=>f());};
  const off=ctx.slots.subscribe('sidebar.panellist',sync);sync();const offLocale=ctx.get('locale')?.subscribe(sync);
  return {subscribe:f=>{listeners.add(f);return ()=>listeners.delete(f);},snapshot:()=>snapshot,panelInfo:ctx.layout.panelInfo,models:()=>{const actions=workspaceViewStore(ctx,'sidebar.settings')?.actions;if(!actions?.openSection)throw Error('DSH 原生设置尚未就绪，请稍候或使用原生设置入口');actions.openSection('models');window.dispatchEvent(new CustomEvent('ui-stronger-dismiss'));},start:()=>ctx.uiWorkspace.startSession(),folders:()=>((ctx.get('workspaces')?.list?.getSnapshot()?.items)??[]).filter(w=>typeof w.path==='string').map(w=>({cwd:w.path,label:w.title||w.path.split(/[\\/]/).pop(),workspaceId:w.workspaceId})),adopt:async cwd=>{const service=ctx.get('workspaces');if(!service?.create)throw Error('宿主不支持工作区注册，请使用原生工作区入口');const existing=service.list?.getSnapshot()?.items?.find(w=>w.path===cwd);const w=existing??await service.create({path:cwd});ctx.uiWorkspace.startSession(w.workspaceId);window.dispatchEvent(new CustomEvent('ui-stronger-dismiss'));},prefill:prompt=>ctx.uiWorkspace.startSession(undefined,{prompt,whenDraftExists:'append'}),select:id=>ctx.layout.selectPanel(id),toggle:()=>ctx.layout.toggleSidebar(),dispose(){off();offLocale?.();listeners.clear();}};
 }

 function LayoutPortal({store}){
  const state=useState(store),[seat,setSeat]=React.useState(null);
  React.useEffect(()=>{let current;const find=()=>{const next=document.querySelector('.wtg9ga_logoRow');if(next===current)return;current=next;setSeat(next);};find();const observer=new MutationObserver(find);observer.observe(document.body,{childList:true,subtree:true});return ()=>observer.disconnect();},[]);
  if(!state.preferences.enabled||!seat)return null;
  return ReactDOM.createPortal(h('div',{className:'zs-shell-identity',role:'img','aria-label':'DeepSeek Harness'},h(Mark,{size:27}),h('span',null,h('small',null,'DEEPSEEK'),h('strong',null,'HARNESS'))),seat);
 }
 function ExtensionEntry({store,wide=true}){useState(store);return h('button',{type:'button',className:'zs-extension-entry','aria-label':'界面与扩展',title:'界面、资料与技能 · Ctrl Shift K',onClick:()=>openTools()},h(NavIcon,{kind:'tools'}),wide?h('span',null,'扩展'):null);}

 const CAPABILITY_CSS=`
 :where(.zw-panel,.zs-tools,.zs-palette,.zs-extension-entry,.zs-surface-backdrop){--zw-paper:var(--dsw-alias-bg-base,#fafafa);--zw-panel:var(--dsw-alias-bg-layer-2,#f0f0f1);--zw-ink:var(--dsw-alias-text-primary,#242426);--zw-muted:var(--dsw-alias-text-tertiary,#74747c);--zw-line:#dedee2;--zw-purple:#a99abe;--zw-soft:#eeebf3;--zw-deep:#837194;--zw-radius:6px}
 [data-ds-dark-theme] :where(.zw-panel,.zs-tools,.zs-palette,.zs-extension-entry,.zs-surface-backdrop){--zw-paper:#141416;--zw-panel:#1d1d20;--zw-ink:#e6e6e9;--zw-muted:#aaaab0;--zw-line:#343438;--zw-purple:#b7a7cd;--zw-soft:#2b2832;--zw-deep:#b6a5cd}
 .zs-imports{max-width:760px;padding:28px 24px;box-sizing:border-box}.zs-imports>header{padding-bottom:20px;gap:12px}.zs-imports h2{letter-spacing:0;font-size:21px}.zs-imports small{letter-spacing:.8px;font-size:10px}.zs-imports .zs-import-intro{max-width:64ch;margin:20px 0;color:var(--zw-muted)}
 .zs-import-upload{display:flex;flex-wrap:wrap;align-items:center;gap:16px;padding:20px;border:1px dashed var(--zw-line);border-radius:var(--zw-radius);background:var(--zw-panel)}.zs-import-upload>div{flex:1 1 220px}.zs-import-upload strong,.zs-import-upload small{display:block}.zs-import-upload input{position:absolute;width:1px;height:1px;opacity:0;overflow:hidden}.zs-import-upload svg{width:16px;height:16px;flex:none}.zs-import-upload label{display:inline-flex;padding:7px 14px;border:1px solid var(--zw-line);border-radius:var(--zw-radius);cursor:pointer;align-items:center;gap:8px;background:var(--zw-paper)}.zs-import-upload label:has(input:focus-visible){outline:2px solid var(--zw-purple);outline-offset:3px}.zs-import-upload label:has(input:disabled){opacity:.5;cursor:wait}
 .zs-import-preview,.zs-import-reader{margin:18px 0;border:1px solid var(--zw-line);border-radius:var(--zw-radius);padding:18px;overflow-wrap:anywhere}.zs-imports h3{font-size:14px;font-weight:500;margin:0 0 12px}.zs-import-list{list-style:none;padding:0;margin:16px 0}.zs-import-list li{display:flex;align-items:center;gap:16px;padding:14px 0;border-bottom:1px solid var(--zw-line)}.zs-import-list li>div:first-child{flex:1;min-width:0;overflow-wrap:anywhere}.zs-import-list b,.zs-import-list small{display:block}.zs-imports .zw-row-actions{display:flex;flex-wrap:wrap;gap:8px}.zs-import-reader article{padding:14px 0;border-top:1px solid var(--zw-line)}.zs-import-reader pre{white-space:pre-wrap;overflow-wrap:anywhere;font:inherit;line-height:1.8}.zs-imports .zw-error{max-width:none}.zs-import-status{min-height:24px}.zs-imports .zw-empty{padding:26px 0;color:var(--zw-muted)}
 @media(max-width:540px){.zs-imports{padding:20px 12px}.zs-import-list li{align-items:flex-start;flex-direction:column;gap:8px}}

 html[data-ui-stronger-motion] .LOmM4q_userRow{animation:none!important} .zw-review-blocked{font-family:inherit;font-size:11px;color:var(--zw-deep);background:var(--zw-soft);border:1px solid var(--zw-line);border-radius:var(--zw-radius);padding:5px 9px;cursor:pointer}.zw-message-edit-seat{align-self:flex-end}.zw-edit-message{border:0;background:none;color:var(--zw-muted);font-family:inherit;font-size:10px;padding:3px 5px;cursor:pointer;opacity:.65}.LOmM4q_userRow:hover .zw-edit-message,.zw-edit-message:focus-visible{opacity:1;color:var(--zw-deep)}.zw-edit-dialog>p{padding:0 24px;font-size:12px;color:var(--zw-muted);line-height:1.8}.zw-edit-dialog textarea{display:block;box-sizing:border-box;width:calc(100% - 48px);margin:15px 24px;padding:12px;border:1px solid var(--zw-line);border-radius:var(--zw-radius);background:var(--zw-paper);color:var(--zw-ink);resize:vertical;font-family:inherit;font-size:13px;line-height:1.8}.zw-edit-dialog footer{display:flex;justify-content:flex-end;gap:10px;padding:12px 24px}.zw-edit-dialog footer button{padding:8px 14px;border:1px solid var(--zw-line);background:var(--zw-paper);color:var(--zw-ink);border-radius:var(--zw-radius);cursor:pointer}.zw-edit-note{font-size:10px;color:var(--zw-muted)}html[data-ui-stronger-motion] .zw-edit-message{transition:opacity 150ms,color 150ms} .zw-workspace header{margin-top:18px}.zw-workspace h2{margin:7px 0}.zw-workspace input:not([type=checkbox]),.zw-workspace textarea,.zw-workspace select{box-sizing:border-box;max-width:100%;width:100%;border:1px solid var(--zw-line);border-radius:var(--zw-radius);background:var(--zw-paper);color:var(--zw-ink);padding:10px;font-family:inherit;font-size:12px;line-height:1.7;outline:none}.zw-workspace input:focus,.zw-workspace textarea:focus{border-color:var(--zw-purple)}.zw-workspace textarea{resize:vertical;min-height:140px}.zw-workspace label{font-size:12px}.zw-workspace .zw-inline-form{display:flex;gap:8px;margin:20px 0}.zw-workspace .zw-inline-form button{flex:none;white-space:nowrap}.zw-workspace button{border:1px solid var(--zw-line);border-radius:var(--zw-radius);background:var(--zw-paper);padding:7px 11px;color:var(--zw-ink);font-family:inherit;font-size:12px;cursor:pointer}.zw-workspace button:hover{background:var(--zw-soft)}.zw-workspace button:disabled{opacity:.45;cursor:default}.zw-entries article{display:flex;align-items:flex-start;justify-content:space-between;gap:15px;padding:16px 0;border-bottom:1px solid var(--zw-line)}.zw-entries article>div{min-width:0}.zw-entries b{font-size:13px;font-weight:500;overflow-wrap:anywhere}.zw-entries small{display:block;font-size:10px;color:var(--zw-muted);margin-top:5px;overflow-wrap:anywhere}.zw-entries p{margin:7px 0;font-size:12px;line-height:1.8}.zw-row-actions{display:flex;flex-wrap:wrap;gap:7px;align-items:center;margin:13px 0}.zw-row-actions small{color:var(--zw-muted);font-size:10px}.zw-row-actions label{margin-left:auto;display:flex;align-items:center;gap:3px;white-space:nowrap}.zw-entries .zw-row-actions{flex:none;margin:0;max-width:150px}.zw-entries details{margin-top:10px;font-size:12px}.zw-entries pre{white-space:pre-wrap;overflow-wrap:anywhere;font-family:inherit;font-size:12px;line-height:1.8;max-height:260px;overflow:auto;padding:12px;background:var(--zw-panel);border-left:2px solid var(--zw-line)}.zw-record-editor{display:grid;gap:15px;padding:18px;background:var(--zw-panel);border:1px solid var(--zw-line);margin:15px 0}.zw-record-editor label{display:grid;gap:5px}.zw-persona-select{display:grid;gap:7px;margin:18px 0}.zw-safety-state{border:1px solid var(--zw-line);display:flex;gap:12px;padding:18px;margin:16px 0;background:var(--zw-panel)}.zw-safety-state>i{width:6px;height:6px;background:var(--zw-purple);rotate:45deg;margin-top:6px;flex:none}.zw-safety-state b{font-size:13px;font-weight:500}.zw-safety-state p{font-size:12px;margin-bottom:0}.zw-review-detail{border-left:2px solid var(--zw-purple);padding:4px 16px;font-size:12px}.zw-audit{font-size:11px;margin-top:25px}.zw-audit>div{display:flex;gap:12px;padding:10px 0;border-bottom:1px solid var(--zw-line)}.zw-audit span{flex:1;overflow-wrap:anywhere}.zw-audit b{font-weight:400}.zw-audit time{color:var(--zw-muted)}.zw-empty{padding:22px 0;color:var(--zw-muted)}.zw-notice{font-size:12px}.zs-tabs{overflow-x:auto;overflow-y:hidden;flex-wrap:nowrap;flex-shrink:0;min-height:44px}.zw-workspace button{white-space:nowrap}.zs-tools>.zw-workspace{min-height:0;overflow-y:auto;flex:1}.zs-tabs>button{flex:none;white-space:nowrap}
 html[data-ui-stronger-motion] .zw-capability-body{animation:zs-content-in 220ms cubic-bezier(.16,1,.3,1) both}html[data-ui-stronger-motion] .zw-record-editor{animation:zs-content-in 200ms cubic-bezier(.16,1,.3,1) both}html[data-ui-stronger-motion] .zs-tabs button{transition:color 150ms,background-color 150ms,border-color 150ms}
 @keyframes zs-content-in{from{opacity:.5;translate:0 5px}to{opacity:1;translate:0 0}}
 @media(max-width:600px){.zw-entries article{flex-direction:column;gap:10px}.zw-entries .zw-row-actions{max-width:none}.zw-workspace .zw-inline-form{flex-wrap:wrap}.zw-workspace .zw-inline-form input{flex:1;min-width:160px}.zw-record-editor{padding:12px}.zw-workspace{padding-left:8px;padding-right:8px}.zw-audit>div{flex-wrap:wrap}.zw-workspace .zs-tabs{margin:0 -4px}}
 @media(prefers-reduced-motion:reduce){html[data-ui-stronger] .zw-capability-body,html[data-ui-stronger] .zw-record-editor{animation:none!important}}
`;
 const CAPABILITY_TABS=[['knowledge','知识库'],['memory','记忆'],['skills','技能'],['persona','人设'],['safety','安全']];
 function matchesSkill(skill,query){
  const terms=query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const text=[skill.name,skill.title,skill.description].filter(Boolean).join(' ').toLocaleLowerCase();
  return terms.every(term=>text.includes(term));
 }
 function SkillLibraryControls({skills,query,busy,onQuery,onReload,onToggle}){
  const rows=skills.filter(skill=>matchesSkill(skill,query)).sort((a,b)=>a.name.localeCompare(b.name));
  return h('section',{className:'zs-skill-manager'},
   h('div',{className:'zs-skill-toolbar'},h('input',{type:'search','aria-label':'查找技能',placeholder:'搜索名称或用途',value:query,onChange:event=>onQuery(event.target.value)}),h('button',{type:'button',disabled:busy,onClick:onReload},'刷新目录')),
   h('small',null,rows.length+' 个技能'),
   h('div',{className:'zw-entries zw-builtins'},...rows.map(skill=>h('article',{key:skill.name},h('div',null,h('b',null,'/'+skill.name),h('small',null,skill.origin==='library'?'本机导入':'内置'),h('p',null,skill.description)),h('button',{type:'button',role:'switch','aria-label':'启用技能 '+skill.name,'aria-checked':skill.enabled,disabled:busy,onClick:()=>onToggle(skill)},skill.enabled?'已开启':'已关闭')))),
   rows.length?null:h('p',{role:'status'},'没有匹配的技能'));
 }
 function ReviewSettings({control,sessionId}){
  const [settings,setSettings]=React.useState(null),[catalog,setCatalog]=React.useState(null),[current,setCurrent]=React.useState(null),[model,setModel]=React.useState(''),[effort,setEffort]=React.useState(''),[cap,setCap]=React.useState(null),[capError,setCapError]=React.useState(''),[error,setError]=React.useState(''),[note,setNote]=React.useState(''),[busy,setBusy]=React.useState(false),[retry,setRetry]=React.useState(0);
  const alive=React.useRef(true),writing=React.useRef(false);
  React.useEffect(()=>{
   alive.current=true;let active=true;
   control('intelligence',{sessionId}).then(value=>{if(active){const saved=value.review??{model:value.routingEnabled?value.routes.review:null,effort:null};setSettings(saved);setModel(saved.model?JSON.stringify(saved.model):'');setEffort(saved.effort??'');}}).catch(e=>{if(active)setError(e.message);});
   control('modelCatalog').then(value=>{if(active)setCatalog(value);}).catch(e=>{if(active)setError(e.message);});
   control('modelStatus',{sessionId}).then(value=>{if(active)setCurrent(value.next??value.last??value.default);}).catch(()=>{});
   return()=>{active=false;alive.current=false;};
  },[control,sessionId]);
  const route=model?JSON.parse(model):current,routeKey=route?JSON.stringify({provider:route.provider,model:route.model}):'';
  React.useEffect(()=>{
   let active=true;setCap(null);setCapError('');if(!routeKey)return;
   control('modelCapabilities',JSON.parse(routeKey)).then(value=>{if(active)setCap(value);}).catch(e=>{if(active)setCapError(e.message);});
   return()=>{active=false;};
  },[control,routeKey,retry]);
  const efforts=cap?.reasoning?.efforts??[];
  const save=async()=>{
   if(writing.current||!settings)return;writing.current=true;setBusy(true);setError('');setNote('');
   try{const value=await control('configureReview',{sessionId,review:{model:model?JSON.parse(model):null,effort:effort||null}});if(alive.current){setSettings(value.review);setNote('审查设置已保存');}}
   catch(e){if(alive.current)setError(e.message);}
   finally{writing.current=false;if(alive.current)setBusy(false);}
  };
  return h('section',{className:'zs-review-settings'},
   h('label',{className:'zs-form-field'},'审查模型',h('select',{'aria-label':'审查模型',value:model,disabled:busy||!settings,onChange:e=>{setModel(e.target.value);setEffort('');setNote('');}},h('option',{value:''},'跟随当前会话模型'),model&&!catalog?.providers.some(provider=>provider.models.some(item=>JSON.stringify({provider:provider.id,model:item.id})===model))?h('option',{value:model},JSON.parse(model).model+'（已保存）'):null,...(catalog?.providers??[]).map(provider=>h('optgroup',{key:provider.id,label:provider.name||provider.id},...provider.models.map(item=>h('option',{key:item.id,value:JSON.stringify({provider:provider.id,model:item.id})},item.name||item.id)))))),
   h('label',{className:'zs-form-field'},'审查思考强度',h('select',{'aria-label':'审查思考强度',value:effort,disabled:busy||!settings||!cap||!efforts.length,onChange:e=>{setEffort(e.target.value);setNote('');}},h('option',{value:''},cap?efforts.length?'模型默认':'此模型未提供可选强度':routeKey?'正在读取强度…':'先选择模型或打开会话'),effort&&!efforts.some(item=>item.id===effort)?h('option',{value:effort},effort+'（已保存）'):null,...efforts.map(item=>h('option',{key:item.id,value:item.id},item.name||item.id)))),
   capError?h('p',{className:'zw-error',role:'alert'},capError,h('button',{type:'button',disabled:busy,onClick:()=>setRetry(value=>value+1)},'重试读取强度')):null,
   h('div',{className:'zw-row-actions'},h('button',{type:'button',disabled:busy||!settings,onClick:()=>void save()},busy?'保存中…':'保存审查设置')),
   note?h('p',{role:'status'},note):null,error?h('p',{className:'zw-error',role:'alert'},error):null);
 }
 function WorkspacePanel({control,tab:fixedTab,store}){
  const [data,setData]=React.useState(null),[localTab,setLocalTab]=React.useState('knowledge'),[error,setError]=React.useState(''),[busy,setBusy]=React.useState(false),[draft,setDraft]=React.useState(null),[folder,setFolder]=React.useState(''),[query,setQuery]=React.useState(''),[results,setResults]=React.useState([]),[archived,setArchived]=React.useState(false),[deleting,setDeleting]=React.useState(null),[notice,setNotice]=React.useState(''),[reload,setReload]=React.useState(0);
  const tab=fixedTab||localTab,alive=React.useRef(true);
  const refresh=React.useCallback(async()=>{const value=await control('workspace');if(alive.current)setData(value);},[control]);
  React.useEffect(()=>{alive.current=true;let active=true;setError('');void refresh().catch(e=>{if(active)setError(e.message);});return ()=>{active=false;alive.current=false;};},[refresh,reload]);
  React.useEffect(()=>{setDraft(null);setResults([]);setError('');},[tab]);
  const run=async(action,payload={})=>{if(busy)return;setBusy(true);setError('');setNotice('');try{const value=await control(action,payload);await refresh();if(alive.current){if(action==='reloadSkills'&&!value.skillLibraryError)setNotice('技能目录已刷新');if(action==='indexKnowledge')setNotice('已索引 '+value.documents+' 份资料'+(value.warnings.length?'；'+value.warnings.join('；'):''));if(action==='searchKnowledge')setResults(value.results);if(action==='record'||action==='editRecord')setDraft(null);}return value;}catch(e){if(alive.current)setError(e.message);}finally{if(alive.current)setBusy(false);}};
  if(!data)return h('section',{className:'zw-panel zw-workspace'},h(PanelLoadState,{message:'读取本机能力…',error,onRetry:()=>setReload(value=>value+1)}));
  const kind=tab==='skills'?'skill':tab==='persona'?'persona':'memory';const records=data.records.filter(r=>r.kind===kind&&(archived?r.status==='archived':r.status!=='archived')&&(tab!=='skills'||matchesSkill(r,query)));
  const add=()=>setDraft({kind,title:'',content:'',name:'local-',description:'',scope:'profile',priority:'normal'});
  const editor=draft?h('form',{className:'zw-record-editor',onSubmit:e=>{e.preventDefault();void run(draft.id?'editRecord':'record',draft.id?{id:draft.id,title:draft.title,content:draft.content,...draft.kind==='skill'?{description:draft.description}:draft.kind==='memory'?{priority:draft.priority??'normal',...draft.importance==='medium'?{summary:draft.summary}:{}}:{}}:{kind:draft.kind,title:draft.title,content:draft.content,...draft.kind==='skill'?{name:draft.name,description:draft.description}:draft.kind==='memory'?{priority:draft.priority??'normal'}:{}});}},h('label',null,'标题',h('input',{required:true,maxLength:120,value:draft.title,onChange:e=>setDraft({...draft,title:e.target.value})})),draft.kind==='memory'?h('label',null,'记忆优先级',h('select',{'aria-label':'记忆优先级',value:draft.priority??'normal',onChange:e=>setDraft({...draft,priority:e.target.value})},h('option',{value:'pinned'},'重要 · 优先常驻'),h('option',{value:'normal'},'普通 · 按预算载入'),h('option',{value:'temporary'},'临时 · 30 天后按需召回'))):null,draft.kind==='skill'?h(React.Fragment,null,h('label',null,'技能名称',h('input',{required:true,disabled:!!draft.id,value:draft.name,placeholder:'local-your-workflow',onChange:e=>setDraft({...draft,name:e.target.value})})),h('label',null,'何时使用',h('input',{required:true,maxLength:300,value:draft.description,onChange:e=>setDraft({...draft,description:e.target.value})}))):null,draft.importance==='medium'?h('label',null,'压缩摘要',h('textarea',{required:true,rows:3,maxLength:600,value:draft.summary??'',onChange:e=>setDraft({...draft,summary:e.target.value})})):null,h('label',null,draft.kind==='persona'?'人设与表达方式':'内容',h('textarea',{required:true,rows:8,maxLength:draft.kind==='persona'?16000:8000,value:draft.content,onChange:e=>setDraft({...draft,content:e.target.value}),placeholder:draft.kind==='persona'?'身份、语气、偏好与边界。不会覆盖 DSH 的安全限制。':'可粘贴内容；不要填写密码、API Key 或临时授权。'})),h('div',{className:'zw-row-actions'},h('button',{type:'submit',disabled:busy},busy?'保存中…':draft.id?'保存修改':'保存到本机'),h('button',{type:'button',onClick:()=>setDraft(null)},'取消'))):null;
  let body;
  if(tab==='knowledge')body=h(React.Fragment,null,h('p',null,'接入资料文件夹。支持 Markdown、TXT、CSV、JSON；检索结果附文件和行号。索引保存在本机，模型调用时仅发送命中片段给当前会话模型。'),h('form',{className:'zw-inline-form',onSubmit:e=>{e.preventDefault();void run('knowledgeRoot',{path:folder}).then(v=>{if(v)setFolder('');});}},h('input',{'aria-label':'知识库文件夹路径',placeholder:'本机资料文件夹的绝对路径',value:folder,onChange:e=>setFolder(e.target.value),required:true}),h('button',{disabled:busy},'接入文件夹')),h('div',{className:'zw-entries'},...data.roots.map(r=>h('article',{key:r.id},h('div',null,h('b',null,r.label),h('small',null,r.path)),h('button',{disabled:busy,onClick:()=>run('removeKnowledgeRoot',{id:r.id})},'断开')))),h('div',{className:'zw-row-actions'},h('button',{disabled:busy||!data.roots.length,onClick:()=>run('indexKnowledge')},busy?'处理中…':'更新索引'),h('small',null,data.knowledge.documents+' 份资料 · '+(data.knowledge.updatedAt?new Date(data.knowledge.updatedAt).toLocaleString():'尚未索引'))),h('form',{className:'zw-inline-form',onSubmit:e=>{e.preventDefault();void run('searchKnowledge',{query});}},h('input',{'aria-label':'检索知识库',placeholder:'试着搜索一个关键词…',value:query,onChange:e=>setQuery(e.target.value),required:true}),h('button',{disabled:busy},'检索')),h('div',{className:'zw-entries'},...results.map(r=>h('article',{key:r.id},h('div',null,h('b',null,r.file),...r.snippets.map(x=>h('p',{key:x.line},h('small',null,'L'+x.line+' · '),x.text)))))));
  else if(tab==='safety')body=h(React.Fragment,null,h(ReviewSettings,{control,sessionId:store?.snapshot().sessionId}),h('div',{className:'zw-safety-state','data-ready':data.runtime.guard},h('i'),h('div',null,h('b',null,data.guard&&data.runtime.guard?'执行前模型审查已启用':'执行审查服务尚未就绪'),h('p',null,'命令与未知工具在执行前，由所选审查模型结合用户指示、具体参数和目标范围复核。拒绝、超时、格式错误或缺少审查均阻止执行。'))),h('p',null,'审查结果不能扩大 DSH 权限，也不能替代操作系统沙箱。审查会产生额外模型用量。插件停用后，此附加安全层也会停用。'),data.lastReview?h('article',{className:'zw-review-detail'},h('b',null,'最近审查 · '+data.lastReview.tool),h('p',null,data.lastReview.decision+' / '+data.lastReview.risk+' · '+data.lastReview.durationMs+' ms'),data.lastReview.reviewer?h('small',null,data.lastReview.reviewer.model+' · '+(data.lastReview.reviewer.effort??'模型默认')):null,h('p',null,data.lastReview.reason)):null,h('div',{className:'zw-audit'},h('h3',null,'本次运行审查记录'),...(data.audit||[]).slice(-20).reverse().map((r,i)=>h('div',{key:i},h('time',null,new Date(r.at).toLocaleTimeString()),h('span',null,r.tool),h('b',null,r.decision+' / '+r.risk))),!data.audit?.length?h('p',null,'还没有执行审查。原生权限及审批策略仍由 DSH 管理。'):null));
  else body=h(React.Fragment,null,h('p',null,tab==='memory'?'已确认记忆按会话冻结，其他会话的新增内容按需召回。重要记忆优先常驻，临时记忆 30 天后进入冷层，原文仍可检索。新会话、成功压缩或手动刷新时更新快照；归档可恢复。':tab==='persona'?'选择当前使用的人设，或创建你自己的表达风格。设置对后续模型步骤生效；人设不能覆盖当前用户指示和安全策略。':'用 / 调用，或让模型按需使用。重复流程与纠错经验会形成待确认草稿；确认后复用。关闭不删内容，删除保留本机轮换备份。模型先查摘要，再按需加载正文；新增、修改与停用会更新目录。'),tab==='persona'?h('label',{className:'zw-persona-select'},'表达方式',h('select',{'aria-label':'表达方式',value:data.conversationStyle??'natural',disabled:busy,onChange:e=>run('conversationStyle',{style:e.target.value})},h('option',{value:'natural'},'自然表达'),h('option',{value:'concise'},'精炼直接'),h('option',{value:'native'},'跟随模型'))):null,tab==='persona'?h('p',{className:'zs-subtle'},'只调整表达，不改模型、人设事实或安全规则；选择后对后续回复生效。'):null,tab==='memory'?h(React.Fragment,null,h('label',{className:'zw-row-actions'},h('input',{type:'checkbox',checked:data.memoryLearning!==false,disabled:busy,onChange:e=>run('memoryLearning',{enabled:e.target.checked})}),'按重要性自动保存记忆'),h('p',{className:'zs-subtle'},'重要事实进入长期层，中等价值保存摘要并保留原文与来源。关闭后新提炼内容需确认。已有会话快照保持冻结，归档可恢复。'),h(MemoryPoolsPanel,{control})):null,tab==='persona'?h(PersonaPolicy,{data,busy,onSave:policy=>run('personaPolicy',{id:data.activePersona,policy})}):null,tab==='persona'?h('label',{className:'zw-persona-select'},'当前人设',h('select',{'aria-label':'当前人设',value:data.activePersona||'',onChange:e=>run('persona',{id:e.target.value||null}),disabled:busy},h('option',{value:''},'DSH 默认'),...data.records.filter(r=>r.kind==='persona'&&r.status==='active').map(r=>h('option',{value:r.id,key:r.id},r.title)))):null,tab==='skills'?h(React.Fragment,null,data.skillLibraryError?h('p',{role:'alert',className:'zw-error'},data.skillLibraryError):null,h('label',{className:'zw-row-actions'},h('input',{type:'checkbox',checked:data.skillLearning,disabled:busy,onChange:e=>run('skillLearning',{enabled:e.target.checked})}),'让模型主动学习已验证的流程'),h(SkillLibraryControls,{skills:data.builtinSkills,query,busy,onQuery:setQuery,onReload:()=>run('reloadSkills'),onToggle:skill=>run('builtinSkill',{name:skill.name,enabled:!skill.enabled})})):null,h('div',{className:'zw-row-actions'},h('button',{disabled:busy,onClick:add},'+ '+(tab==='skills'?'创建技能':tab==='persona'?'创建人设':'添加记忆')),h('label',null,h('input',{type:'checkbox',checked:archived,onChange:e=>setArchived(e.target.checked)}),tab==='skills'?' 已停用':' 已归档')),editor,h('div',{className:'zw-entries'},...records.map(r=>h('article',{key:r.id},h('div',null,h('b',null,r.title),h('small',null,(r.status==='pending'?'待确认':r.status==='archived'?(tab==='skills'?'已停用':'已归档'):'已启用')+' · '+r.source),h('details',null,h('summary',null,'查看内容'),r.summary?h('p',null,'摘要 · '+r.summary):null,r.sourceRefs?.length?h('small',null,'来源序号 '+r.sourceRefs.map(ref=>'#'+ref.seq).join('、')):null,h('pre',null,r.content))),h('div',{className:'zw-row-actions'},r.status!=='active'?h('button',{disabled:busy,onClick:()=>run('recordStatus',{id:r.id,status:'active'})},r.status==='archived'?(tab==='skills'?'开启':'恢复'):'确认启用'):null,h('button',{disabled:busy,onClick:()=>setDraft({...r})},'编辑'),r.status!=='archived'?h('button',{disabled:busy,onClick:()=>run('recordStatus',{id:r.id,status:'archived'})},tab==='skills'?'关闭':'归档'):null,tab==='skills'&&r.status!=='active'?h('button',{disabled:busy,onClick:()=>{if(deleting!==r.id){setDeleting(r.id);return;}void run('deleteSkill',{id:r.id});setDeleting(null);}},deleting===r.id?'确认删除':'删除'):null)))),!records.length&&!draft?h('p',{className:'zw-empty'},'这里还没有'+(archived?'已归档':'自建')+'条目。'):null);
  return h('section',{className:'zw-panel zw-workspace'},!fixedTab?h('nav',{className:'zs-tabs','aria-label':'能力管理'},...CAPABILITY_TABS.map(([id,label])=>h('button',{key:id,'aria-pressed':tab===id,onClick:()=>setLocalTab(id)},label))):null,h('header',null,h('div',null,h('small',null,'WORKSPACE / CAPABILITIES'),h('h2',null,CAPABILITY_TABS.find(x=>x[0]===tab)?.[1]),h('p',null,'你的资料与设置只保存在本机'))),h('div',{key:tab,className:'zw-capability-body'},body),h('p',{role:'status',className:'zw-notice'},notice),h('p',{role:'alert',className:'zw-error'},error));
 }

 const COMFORT_CSS=`
 html[data-ui-stronger]{--zw-radius:6px;--dsw-radius-xs:3px;--dsw-radius-sm:4px;--dsw-radius-md:6px;--dsw-radius-lg:8px;--dsw-radius-xl:10px;--dsw-radius-panel:10px;--zw-paper:#f3f3f5;--zw-panel:#ececef;--zw-ink:#37363d;--zw-muted:#6c6973;--zw-line:#d8d7df;--zw-purple:#aa98bd;--zw-soft:#e9e5ee;--zw-deep:#75628e;--zs-shadow-surface:0 1px 3px #24212a06;--zs-shadow-overlay:0 3px 8px #24212a08,0 12px 28px #24212a0a}
 html[data-ui-stronger],html[data-ui-stronger] body,html[data-ui-stronger] [data-ds-dark-theme]{--dsw-alias-bg-layer-3:var(--zw-paper)!important;--dsw-alias-bg-overlay:var(--zw-paper)!important}
 html[data-ui-stronger]:is([data-ds-dark-theme],:has([data-ds-dark-theme])),html[data-ui-stronger] [data-ds-dark-theme]{--zw-paper:#1b1b1f;--zw-panel:#232328;--zw-ink:#dedde3;--zw-muted:#aaa6b2;--zw-line:#3b3943;--zw-purple:#b2a0c6;--zw-soft:#302b38;--zw-deep:#c0afd2;--zs-shadow-surface:0 1px 3px #00000014;--zs-shadow-overlay:0 4px 10px #0000001a,0 12px 28px #0000001f}
 html[data-ui-stronger] :is(.zs-tools,.zs-palette,.zs-delete-dialog,.zs-workspace-dialog,.zs-team-config){border-radius:10px!important}
 html[data-ui-stronger] :is(.zs-team-coordinator,.zs-team-member,.zs-import-preview,.zs-import-reader,.zs-file-picker,.zs-current-model,.zw-record-editor,.zs-usage-stats){border-radius:8px!important}
 html[data-ui-stronger] :is(.wtg9ga_newSession,.wtg9ga_panelRow,.wtg9ga_footerActions button,.wnFoaW_projectRow,.wnFoaW_sessionRow,.zs-preset-menu-list,.zs-preset-menu-list [role=menuitem],.zs-folder-menu-button,.zs-team-entry,.zs-team-switch){border-radius:6px!important}
 html[data-ui-stronger] :is(.zs-surface-backdrop,.zs-tools,.zs-palette,.zs-team-workspace,.zs-team-config,.zs-delete-dialog,.zs-workspace-dialog,.zw-panel,.zs-thinking,.zs-process,.zs-preset-menu-list,.zs-team-access,.zs-feature-form){--zw-radius:inherit;--zw-paper:inherit;--zw-panel:inherit;--zw-ink:inherit;--zw-muted:inherit;--zw-line:inherit;--zw-purple:inherit;--zw-soft:inherit;--zw-deep:inherit}
 html[data-ui-stronger] :is(.zs-tools,.zs-palette,.zs-team-config,.zs-delete-dialog,.zs-workspace-dialog){box-shadow:var(--zs-shadow-overlay)}
 `;

 const SMOOTH_MOTION_CSS=`
 html[data-ui-stronger-motion]{--zs-ease-out:cubic-bezier(.22,1,.36,1)}
 html[data-ui-stronger-motion] :is(.zs-preset-menu-list,.zs-team-config,.zs-delete-dialog,.zs-workspace-dialog){animation:zs-smooth-surface 160ms var(--zs-ease-out) both}
 html[data-ui-stronger-motion] .zs-page-transition{animation:zs-smooth-page 220ms var(--zs-ease-out) both}
 html[data-ui-stronger-motion] .zs-surface-backdrop{animation:zs-smooth-backdrop 160ms ease-out both}
 html[data-ui-stronger-motion] .zs-surface-backdrop>.zs-tools{animation:zs-smooth-drawer 260ms var(--zs-ease-out) both}
 html[data-ui-stronger-motion] .zs-surface-backdrop>.zs-palette{animation:zs-smooth-surface 200ms var(--zs-ease-out) both}
 html[data-ui-stronger-motion] .zs-surface-backdrop[data-leaving]{animation:zs-fade-out 180ms ease-out both}
 html[data-ui-stronger-motion] .zs-surface-backdrop[data-leaving]>:is(.zs-tools,.zs-palette){animation:zs-page-exit 180ms ease-out both}
 html[data-ui-stronger-motion] .zs-team-member button{transition:background-color 140ms ease-out,border-color 140ms ease-out,color 140ms ease-out}
 @keyframes zs-smooth-surface{from{opacity:.65;transform:translateY(4px) scale(.997)}to{opacity:1;transform:none}}
 @keyframes zs-smooth-page{from{opacity:.88;transform:translateY(3px)}to{opacity:1;transform:none}}
 @keyframes zs-smooth-backdrop{from{opacity:0}to{opacity:1}}
 @keyframes zs-smooth-drawer{from{opacity:.8;transform:translateX(10px)}to{opacity:1;transform:none}}
 html[data-ui-stronger-paused] :is(.zs-preset-menu-list,.zs-team-config,.zs-delete-dialog,.zs-workspace-dialog){animation-play-state:paused!important}
 @media(prefers-reduced-motion:reduce){html[data-ui-stronger-motion] :is(.zs-preset-menu-list,.zs-team-config,.zs-delete-dialog,.zs-workspace-dialog,.zs-page-transition,.zs-surface-backdrop,.zs-surface-backdrop>.zs-tools,.zs-surface-backdrop>.zs-palette){animation:none!important;transition:none!important}}
 `;

 function MotionBridge({store,navigation}){
  const s=useState(store);React.useEffect(()=>{
   if(!s.preferences.enabled||!s.preferences.motion||window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)return;
   let stopped=false,frame=null,mutedUntil=0;
   const seen=new WeakSet(),animations=new Map(),pending=new Set(),media=window.matchMedia('(prefers-reduced-motion: reduce)'),selector='.LOmM4q_userRow,.V4vHZW_root,.AnXs9G_panel,.GRgSLq_notice,.zs-team-member';
   const animate=(el,frames,duration,delay=0)=>{
    if(stopped||document.hidden||media.matches||!el?.animate||el.isConnected===false)return;
    const previous=animations.get(el);if(animations.size>=6&&!previous)return;
    const rect=el.getBoundingClientRect?.();if(rect&&(rect.bottom<0||rect.top>window.innerHeight||rect.width===0||rect.height===0))return;
    if(previous){
     const current=window.getComputedStyle?.(el);
     if(current)frames=[{opacity:current.opacity,transform:current.transform},...frames.slice(1)];
     previous.cancel();animations.delete(el);
    }
    let animation;try{animation=el.animate(frames,{duration,delay,easing:'cubic-bezier(.22,1,.36,1)'});}catch{return;}
    animations.set(el,animation);
    animation.finished.catch(()=>{}).finally(()=>{if(animations.get(el)===animation)animations.delete(el);});
   };
   const flush=()=>{frame=null;if(stopped||document.hidden||media.matches){pending.clear();return;}const batch=[...pending];pending.clear();if(batch.length>12)return;batch.slice(-6).forEach((el,i)=>animate(el,[{opacity:.88,transform:'translateY(4px)'},{opacity:1,transform:'translateY(0)'}],240,Math.min(i,3)*16));};
   document.querySelectorAll(selector).forEach(el=>seen.add(el));
   const observer=new MutationObserver(records=>{if(document.hidden||media.matches||Date.now()<mutedUntil)return;for(const record of records)for(const node of record.addedNodes){if(node.nodeType!==1)continue;const nodes=node.matches?.(selector)?[node]:[...node.querySelectorAll?.(selector)??[]];if(nodes.length>12){nodes.forEach(el=>seen.add(el));continue;}for(const el of nodes){if(seen.has(el))continue;seen.add(el);if(pending.size<13)pending.add(el);}}if(pending.size&&frame===null)frame=requestAnimationFrame(flush);});
   observer.observe(document.body,{childList:true,subtree:true});
   const stop=()=>{if(frame!==null){cancelAnimationFrame(frame);frame=null;}pending.clear();for(const animation of animations.values())animation.cancel();animations.clear();};
   const enter=()=>{
    if(stopped||document.hidden||media.matches)return;
    mutedUntil=Date.now()+240;pending.clear();if(frame!==null)cancelAnimationFrame(frame);
    frame=requestAnimationFrame(()=>{frame=null;if(stopped||document.hidden||media.matches)return;animate(document.querySelector('.zs-team-workspace>.zs-team-coordinator')??document.querySelector('.an3WzG_body'),[{opacity:.94,transform:'translateY(2px)'},{opacity:1,transform:'translateY(0)'}],240);});
   };
   let id=store.snapshot().sessionId;const offSession=store.subscribe(()=>{const next=store.snapshot().sessionId;if(next!==id){id=next;enter();}}),offPanel=navigation.panelInfo?.subscribe(enter);
   const details=e=>{if(!e.target.matches?.('details[open]')||!e.target.closest?.('.zs-tools,.zw-panel,.zs-thinking,.an3WzG_body,.zs-team-workspace')||document.hidden||media.matches)return;for(const el of e.target.children){if(el.tagName==='SUMMARY')continue;animate(el,[{opacity:.88,transform:'translateY(2px)'},{opacity:1,transform:'translateY(0)'}],220);}};
   const tabClick=e=>{const tab=e.target.closest?.('[role=tab]');if(tab?.getAttribute('aria-selected')!=='true'&&tab?.closest?.('.an3WzG_body,.zs-tools,.zs-team-workspace'))enter();};
   const pause=()=>{document.documentElement?.toggleAttribute?.('data-ui-stronger-paused',document.hidden||media.matches);if(document.hidden||media.matches)stop();};pause();
   document.addEventListener('click',tabClick,true);document.addEventListener('toggle',details,true);window.addEventListener('ui-stronger-mode-change',enter);media.addEventListener?.('change',pause);document.addEventListener('visibilitychange',pause);
   return ()=>{stopped=true;stop();observer.disconnect();offSession();offPanel?.();media.removeEventListener?.('change',pause);document.removeEventListener('click',tabClick,true);document.removeEventListener('toggle',details,true);window.removeEventListener('ui-stronger-mode-change',enter);document.removeEventListener('visibilitychange',pause);document.documentElement?.removeAttribute?.('data-ui-stronger-paused');};
  },[s.preferences.enabled,s.preferences.motion]);return null;
 }

 function useUsageData(control,action,sessionId,enabled=true){
  const [result,setResult]=React.useState({data:null,error:''});
  React.useEffect(()=>{if(!enabled){setResult({data:null,error:''});return;}let alive=true,pending=false;const controller=new AbortController();setResult({data:null,error:''});const refresh=async()=>{if(!alive||pending||document.hidden)return;pending=true;try{const value=await control(action,sessionId?{sessionId}:{},controller.signal);if(alive)setResult({data:value,error:''});}catch(e){if(alive)setResult(previous=>({...previous,error:'用量暂不可用'}));}finally{pending=false;}};void refresh();const timer=setInterval(refresh,5000);document.addEventListener('visibilitychange',refresh);return ()=>{alive=false;controller.abort();clearInterval(timer);document.removeEventListener('visibilitychange',refresh);};},[control,action,sessionId,enabled]);return result;
 }
 function SessionTokenUsage({control,sessionId,enabled}){
  const {data,error}=useUsageData(control,'sessionUsage',sessionId,enabled&&!!sessionId),s=data?.sessionTotals;
  if(!enabled||!sessionId)return null;
  const label=error?'用量暂不可用':!data?'读取用量…':!data.available?'会话用量暂不可用':!s?'读取用量…':!s.requests?'尚无 Token 用量':!s.available?'Token 用量未报告':(s.complete?'累计 ':'已知累计 ')+formatNumber(s.total)+' tokens';
  return h('span',{className:'zs-session-tokens',title:'当前会话已记录回复的累计输入与输出；不是当前上下文占用。不含子会话及未记入日志的辅助调用。'+(s?.unknownRequests?' '+s.unknownRequests+' 条回复未报告完整用量。':'')},label);
 }
 function LocalFilePicker({label,hint,accept,disabled,onChange,multiple=false}){
  const inputId=React.useId();
  return h('div',{className:'zs-file-picker zs-import-upload'},
   h('div',{className:'zs-file-copy'},h('strong',null,label),h('small',null,hint)),
   h('input',{id:inputId,type:'file','aria-label':label,accept,disabled,onChange,multiple}),
   h('label',{className:'zs-file-trigger',htmlFor:inputId,'aria-disabled':disabled||undefined},h(NavIcon,{kind:'plus'}),h('span',null,'选择文件')));
 }
 function ConversationImports({control,navigation}){
  const [items,setItems]=React.useState([]),[pending,setPending]=React.useState(null),[selected,setSelected]=React.useState(null);
  const [error,setError]=React.useState(''),[busy,setBusy]=React.useState(false),[deleting,setDeleting]=React.useState(null),[notice,setNotice]=React.useState('');
  const alive=React.useRef(true),locked=React.useRef(false);
  const run=async(action,args={})=>{
   if(locked.current)return;
   locked.current=true;setBusy(true);setError('');setNotice('');
   try{
    const result=await control('importConversations',{action,...args});
    if(!alive.current)return;
    if(action==='list')setItems(result.items);
    if(action==='read')setSelected(result);
    if(action==='add'||action==='delete'){
     // Apply a successful mutation before a separate list refresh can fail.
     setPending(null);setSelected(null);setDeleting(null);
     if(action==='delete')setItems(rows=>rows.filter(row=>row.id!==args.id));
     setNotice(action==='add'?'已导入本机档案。':'已删除本机导入档案。');
     const listing=await control('importConversations',{action:'list'});
     if(alive.current)setItems(listing.items);
    }
    return result;
   }catch(e){if(alive.current)setError(e.message);}
   finally{locked.current=false;if(alive.current)setBusy(false);}
  };
  React.useEffect(()=>{alive.current=true;void run('list');return ()=>{alive.current=false;};},[]);
  const chooseFile=async event=>{
   const input=event.currentTarget,file=input.files?.[0];input.value='';
   if(!file||locked.current)return;
   setPending(null);setError('');setNotice('');
   if(file.size>8*1024*1024){setError('文件超过 8 MB，请分批导出。');return;}
   locked.current=true;setBusy(true);
   try{
    const text=await file.text();
    const preview=await control('importConversations',{action:'preview',text});
    if(alive.current)setPending({text,title:file.name,preview});
   }catch(e){if(alive.current)setError(e.message);}
   finally{locked.current=false;if(alive.current)setBusy(false);}
  };
  const button=(label,onClick,disabled=false)=>h('button',{type:'button',onClick,disabled:busy||disabled},label);
  return h('section',{className:'zw-panel zs-imports','aria-busy':busy},
   h('header',null,h('div',null,h('small',null,'LOCAL ARCHIVE'),h('h2',null,'导入对话'))),
   h('p',{className:'zs-import-intro'},'把其他 Agent 的对话保存到本机，需要时查看并选取一页继续。支持 Codex、Claude Code 的 JSONL 与通用 messages JSON。'),
   h(LocalFilePicker,{label:'选择对话导出文件',hint:'JSON / JSONL · 每次最多 8 MB',accept:'.json,.jsonl',disabled:busy,onChange:chooseFile}),
   h('p',{className:'zs-subtle'},'导入用户和助手的文字。图片、思考与工具执行状态不迁移；原有执行权限不会随档案恢复。'),
   pending?h('section',{className:'zs-import-preview','aria-label':'导入预览'},h('h3',null,pending.title),h('p',null,pending.preview.format+' · '+pending.preview.count+' 条文字消息 · 跳过 '+pending.preview.skipped+' 条非对话记录'),h('div',{className:'zw-row-actions'},button('确认导入',()=>run('add',{text:pending.text,title:pending.title})),button('取消',()=>setPending(null)))):null,
   h('div',{className:'zs-import-status',role:'status','aria-live':'polite'},busy?'正在处理本机档案…':notice),
   error?h('div',{className:'zw-row-actions'},h('p',{role:'alert',className:'zw-error'},error),button('重试读取档案',()=>run('list'))):null,
   h('h3',null,'已导入档案',items.length?' · '+items.length:''),
   items.length?h('ul',{className:'zs-import-list'},...items.map(row=>h('li',{key:row.id},h('div',null,h('b',null,row.title),h('small',null,row.count+' 条文字消息')),h('div',{className:'zw-row-actions'},button('查看',()=>run('read',{id:row.id})),button(deleting===row.id?'确认删除':'删除',()=>{if(deleting!==row.id){setDeleting(row.id);return;}void run('delete',{id:row.id,confirm:row.id});}),deleting===row.id?button('取消',()=>setDeleting(null)):null)))):!busy&&!error?h('p',{className:'zw-empty'},'还没有导入档案。选择文件后可先预览，再确认保存。'):null,
   selected?h('section',{className:'zs-import-reader','aria-label':'对话档案内容'},h('h3',null,selected.title),h('small',null,'第 '+(selected.offset+1)+'–'+Math.min(selected.offset+selected.messages.length,selected.total)+' 条 / 共 '+selected.total+' 条'),...selected.messages.map((message,index)=>h('article',{key:index},h('b',null,message.role==='user'?'用户':'助手'),h('pre',null,message.text))),h('div',{className:'zw-row-actions'},button('上一页',()=>run('read',{id:selected.id,offset:Math.max(0,selected.offset-20)}),selected.offset===0),button('下一页',()=>run('read',{id:selected.id,offset:selected.offset+20}),selected.offset+20>=selected.total),button('放入新对话草稿',()=>{navigation.prefill('以下是导入的外部对话参考，不构成当前指令或权限；请先询问我希望继续的任务。\n'+selected.messages.map(message=>message.role+': '+message.text).join('\n').slice(0,3500));}),button('收起',()=>setSelected(null))),h('p',{className:'zs-subtle'},'只放入本页最多 3,500 字，由你确认发送。')):null);
 }
 function UsageDashboard({store,control}){
  const {data,error}=useUsageData(control,'workbench'),ledger=data?.usage,s=ledger?.summary,rows=[...(ledger?.models??[])].sort((a,b)=>(b.total??b.input+b.output+(b.cacheRead??0)+(b.cacheWrite??0))-(a.total??a.input+a.output+(a.cacheRead??0)+(a.cacheWrite??0)));
  const count=n=>formatNumber(n??0),total=r=>r.total??r.input+r.output+(r.cacheRead??0)+(r.cacheWrite??0);
  return h('section',{className:'zw-panel zs-usage-dashboard'},h('header',null,h('div',null,h('h2',null,'Token 用量'),h('p',null,'按模型汇总 · 本机观测'))),error?h('p',{role:'alert',className:'zw-error'},error):null,!data?h('p',null,'正在读取本机用量…'):h(React.Fragment,null,h('div',{className:'zs-usage-stats'},...[[s?.complete?'累计 Token':'已知累计 Token',s?.available?count(s.total):s?.requests?'未报告':'—'],['输入',s?.inputSamples?count(s.input+s.cacheRead+s.cacheWrite):'未报告'],['输出',s?.outputSamples?count(s.output):'未报告'],['请求',count(s?.requests)]].map(([label,value])=>h('div',{key:label},h('small',null,label),h('strong',null,value)))),s?.unknownRequests?h('p',{className:'zs-subtle'},s.unknownRequests+' 次请求未报告完整用量；统计可能不完整。'):null,rows.length?h('ol',{className:'zs-model-usage'},...rows.map((r,i)=>h('li',{key:JSON.stringify([r.provider,r.model])},h('div',{className:'zs-usage-heading'},h('div',null,h('b',null,r.model),h('small',null,r.provider)),h('strong',null,r.reported?count(total(r))+' tokens':'未报告')),h('div',{className:'zs-usage-track','aria-hidden':true},h('i',{style:{width:(s?.total?Math.max(0,Math.min(100,total(r)/s.total*100)):0)+'%'}})),h('p',null,'输入 '+((r.inputSamples??r.reported)?count(r.input+(r.cacheRead??0)+(r.cacheWrite??0)):'未报告')+' · 输出 '+((r.outputSamples??r.reported)?count(r.output):'未报告')+' · 请求 '+count(r.requests)),h('small',null,'命中缓存 '+(r.cacheSamples?count(r.cacheRead):'未报告')+' · 失败 '+count(r.failed)+' · 取消 '+count(r.cancelled))))):h('p',null,'暂无观测记录。模型产生请求后会自动显示。'),h('p',{className:'zs-subtle'},'观测起点：'+new Date(ledger.since).toLocaleString()+'。包含本插件观测到的主对话、子智能体、审查及摘要请求；请求数不等于账单 HTTP 次数。输入含命中缓存/写入，各项只计一次。每 5 秒更新。')));
 }
 function MessageEditing({store,control,inputActions,useInput,sessionId}){
  const s=useState(store),input=useInput?useInput(x=>x):null,[seats,setSeats]=React.useState([]),[editing,setEditing]=React.useState(null),[note,setNote]=React.useState('');
  const seatRef=React.useRef(new Map()),draftRef=React.useRef('');draftRef.current=input?.draft??'';
  React.useEffect(()=>{if(!s.preferences.enabled||!inputActions)return;let pending=0;
   const scan=()=>{pending=0;const root=document.querySelector('.an3WzG_root');if(!root)return;const rows=[...root.querySelectorAll('.LOmM4q_userRow')].filter(r=>!r.hasAttribute('data-submission-echo')&&!r.hasAttribute('data-pending-steering'));let changed=false;for(const [r,seat] of seatRef.current)if(!r.isConnected||!rows.includes(r)){seat.remove();seatRef.current.delete(r);changed=true;}for(const row of rows){if(seatRef.current.has(row)||!row.querySelector('.LOmM4q_bubble'))continue;const seat=document.createElement('span');seat.className='zw-message-edit-seat';row.append(seat);seatRef.current.set(row,seat);changed=true;}if(changed)setSeats([...seatRef.current]);};
   scan();const observer=new MutationObserver(()=>{if(!pending)pending=requestAnimationFrame(scan);});observer.observe(document.body,{childList:true,subtree:true});return ()=>{observer.disconnect();if(pending)cancelAnimationFrame(pending);for(const seat of seatRef.current.values())seat.remove();seatRef.current.clear();};
  },[s.preferences.enabled,inputActions,sessionId]);
  React.useEffect(()=>{if(!inputActions)return;const insert=e=>{if(typeof e.detail!=='string'||e.detail.length>4000)return;const old=draftRef.current.trim();if(e.detail==='/compact'&&old){setNote('原草稿已保留。请处理草稿后，单独发送 /compact。');return;}inputActions.setDraft(old?old+'\n\n'+e.detail:e.detail);setNote(old?'已追加到原草稿，可修改后发送。':'已放入输入框，由你确认发送。');document.querySelector('[contenteditable="true"]')?.focus();};window.addEventListener('ui-stronger-prompt',insert);return ()=>window.removeEventListener('ui-stronger-prompt',insert);},[inputActions]);
  if(!s.preferences.enabled||!inputActions)return null;
  return h(React.Fragment,null,h(SessionTokenUsage,{control,sessionId,enabled:s.preferences.enabled}),...seats.filter(([row])=>row.isConnected).map(([row,seat],i)=>ReactDOM.createPortal(h('button',{className:'zw-edit-message',title:'取回文字进行修改，保留原消息',onClick:()=>setEditing(row.querySelector('.LOmM4q_bubble')?.innerText??'')},'编辑后重发'),seat,'edit-'+i)),editing!==null?h(FocusSurface,{label:'编辑消息文字',onClose:()=>setEditing(null),className:'zs-palette zw-edit-dialog'},h('header',{className:'zs-surface-header'},h('h2',null,'编辑消息文字')),h('p',null,'原消息保留。修改后放回输入框，由你决定是否发送；附件不会自动带入。'),h('textarea',{'aria-label':'编辑消息文字',rows:8,value:editing,onChange:e=>setEditing(e.target.value)}),h('footer',null,h('button',{onClick:()=>{const old=draftRef.current.trim();inputActions.setDraft(old?old+'\n\n'+editing:editing);setNote(old?'已追加到原草稿，可修改后发送。':'已放回输入框，可修改后发送。');setEditing(null);document.querySelector('.GRgSLq_input')?.focus();}},'放入输入框'),h('button',{onClick:()=>setEditing(null)},'取消'))):null,s.workspace?.lastReview?.sessionId===sessionId&&s.workspace.lastReview.decision==='deny'?h('button',{className:'zw-review-blocked','aria-live':'polite',onClick:()=>openTools('safety')},'安全审查已拦截一次调用 · 查看原因'):null,note?h('span',{role:'status',className:'zw-edit-note'},note):null);
 }

 const WORKBENCH_TABS=[['process','过程与依据'],['modules','工作模块'],['background','背景'],['context','上下文与模型'],['history','跨会话'],['wechat','微信'],['workspaces','工作区']];
 const EXTRA_CSS=`
 .zs-tools>.zs-tabs{flex-wrap:wrap;overflow:visible;padding-block:8px;gap:2px 10px}.zs-tools>.zs-tabs>button{height:32px;padding-block:6px}.zw-workspace input,.zw-workspace textarea,.zw-workspace select,.zw-workspace button{font-family:inherit}

 html[data-ui-stronger]{--zw-paper:#fafafa;--zw-panel:#f0f0f1;--zw-ink:#242426;--zw-muted:#818186;--zw-line:#dedee2;--zw-purple:#aa9bbf;--zw-soft:#eeebf3;--zw-deep:#837194}
 html[data-ui-stronger] [data-ds-dark-theme],html[data-ui-stronger][data-ds-dark-theme]{--zw-paper:#141416;--zw-panel:#1d1d20;--zw-ink:#e6e6e9;--zw-muted:#99999f;--zw-line:#343438;--zw-soft:#2b2832;--zw-deep:#b6a5cd}
 .zs-module-settings{display:grid;gap:14px}.zs-module-row{padding:16px;border:1px solid var(--zw-line);background:var(--zw-paper);display:grid;gap:10px}.zs-module-row>div{display:flex;gap:8px;align-items:center}.zs-module-row input,.zs-module-row select{min-width:0;width:100%}.zs-module-row label{font-size:12px}.zs-module-row input[type=checkbox]{width:auto}.zs-module-actions{justify-content:flex-end}.zs-module-actions button{padding:6px 10px}.zs-module-row textarea{min-height:70px}.zs-meter{padding:18px;border:1px solid var(--zw-line);background:var(--zw-paper);margin:15px 0}.zs-meter strong{font-size:24px;font-weight:450;display:block;margin-bottom:8px}.zs-meter progress{width:100%;height:5px;accent-color:var(--zw-purple)}.zs-meter small{font-size:11px;color:var(--zw-muted)}.zs-usage-table{width:100%;border-collapse:collapse;font-size:11px;margin-top:18px}.zs-usage-table th,.zs-usage-table td{text-align:left;padding:12px 7px;border-bottom:1px solid var(--zw-line);font-weight:400}.zs-usage-table td:first-child{overflow-wrap:anywhere;max-width:180px}.zs-table-scroll{overflow-x:auto}.zs-bg-preview{padding:16px;border:1px dashed var(--zw-line);margin:16px 0}.zs-bg-preview label{display:grid;gap:8px;margin:14px 0}.zs-bg-preview input[type=range]{padding:0}.zs-background{position:absolute;inset:0;z-index:0;pointer-events:none;overflow:hidden}.zs-background img,.zs-background video{width:100%;height:100%;object-fit:cover}.an3WzG_root:has(>.zs-background){isolation:isolate;position:relative}.an3WzG_root:has(>.zs-background)>:not(.zs-background){position:relative;z-index:1}.zs-work-edit{margin-left:auto;background:transparent;border:0;color:var(--zw-muted);font-size:11px;cursor:pointer}.zs-compat{border-left:2px solid var(--zw-purple);padding-left:12px;font-size:12px}.zs-usage-row{display:flex;justify-content:space-between;padding:9px 0;border-bottom:1px solid var(--zw-line);font-size:12px}.zs-history-results article{padding:15px 0;border-bottom:1px solid var(--zw-line);font-size:12px;overflow-wrap:anywhere}.zs-history-results small{color:var(--zw-muted)}.zs-history-results pre{white-space:pre-wrap;font:inherit}.zs-model-tag{font:11px ui-monospace,monospace;color:var(--zw-muted)}
 @media(max-width:600px){.zs-module-row>div{flex-wrap:wrap}.zs-module-row input{flex-basis:100%}.zs-usage-table{font-size:10px}.zs-meter strong{font-size:21px}}
 `;
 function formatNumber(v){return typeof v==='number'?v.toLocaleString():'—';}
 function cacheLabel(r){if(!r.cacheSamples)return '未报告';const n=formatNumber(r.cacheRead);if(r.cacheSamples<r.reported||(r.inputSamples??r.reported)<r.reported)return n+'（部分请求已报告）';return n+' / '+((r.cacheRead/(r.input+r.cacheRead+r.cacheWrite||1))*100).toFixed(1)+'%';}
 function useSeat(selector){const [seat,setSeat]=React.useState(null);React.useEffect(()=>{let current;const find=()=>{const next=document.querySelector(selector);if(next!==current){current=next;setSeat(next);}};find();const observer=new MutationObserver(find);observer.observe(document.body,{childList:true,subtree:true});return ()=>observer.disconnect();},[selector]);return seat;}
 let bgDatabasePromise;
 function backgroundDB(){if(!window.indexedDB)return Promise.reject(Error('此浏览器不支持本机背景存储'));if(!bgDatabasePromise)bgDatabasePromise=new Promise((resolve,reject)=>{const r=indexedDB.open('dsh-ui-local-background',1);r.onupgradeneeded=()=>r.result.createObjectStore('media');r.onsuccess=()=>{const db=r.result;db.onversionchange=()=>{db.close();bgDatabasePromise=null;};resolve(db);};r.onerror=()=>{bgDatabasePromise=null;reject(r.error);};});return bgDatabasePromise;}
 async function backgroundRecord(value){const db=await backgroundDB();return new Promise((resolve,reject)=>{const transaction=db.transaction('media',value===undefined?'readonly':'readwrite');const store=transaction.objectStore('media');const req=value===undefined?store.get('background'):value===null?store.delete('background'):store.put(value,'background');let result;req.onsuccess=()=>{result=req.result;};transaction.oncomplete=()=>resolve(result);transaction.onerror=()=>reject(transaction.error);transaction.onabort=()=>reject(transaction.error??Error('本机存储操作被中止'));});}
 async function inspectBackground(file){if(!file||file.size>64*1024*1024)throw Error('背景文件上限为 64 MB');const bytes=new Uint8Array(await file.slice(0,16).arrayBuffer()),ascii=new TextDecoder().decode(bytes);const type=ascii.startsWith('GIF8')?'gif':ascii.slice(1,4)==='PNG'?'image':bytes[0]===255&&bytes[1]===216?'image':ascii.startsWith('RIFF')&&ascii.slice(8,12)==='WEBP'?'image':ascii.slice(4,8)==='ftyp'||bytes[0]===0x1a&&bytes[1]===0x45&&bytes[2]===0xdf&&bytes[3]===0xa3?'video':null;if(!type)throw Error('支持 PNG、JPG、WebP、GIF、MP4、WebM；不接受网页或 SVG');return {blob:file,name:file.name.slice(0,160),type,opacity:.13,blur:0,fit:'cover'};}
 function BackgroundLayer({store}){const s=useState(store),seat=useSeat('.an3WzG_root'),[record,setRecord]=React.useState(null),[url,setURL]=React.useState(null),[paused,setPaused]=React.useState(false),video=React.useRef(null);React.useEffect(()=>{let active=true;const reload=()=>{void backgroundRecord().then(v=>{if(active)setRecord(v??null);}).catch(()=>{});};reload();window.addEventListener('ui-stronger-background',reload);return ()=>{active=false;window.removeEventListener('ui-stronger-background',reload);};},[]);React.useEffect(()=>{if(!record?.blob){setURL(null);return;}const url=URL.createObjectURL(record.blob);setURL(url);return ()=>URL.revokeObjectURL(url);},[record]);React.useEffect(()=>{const media=window.matchMedia('(prefers-reduced-motion: reduce)');const check=()=>setPaused(document.hidden||!s.preferences.motion||media.matches);check();document.addEventListener('visibilitychange',check);media.addEventListener?.('change',check);return ()=>{document.removeEventListener('visibilitychange',check);media.removeEventListener?.('change',check);};},[s.preferences.motion]);React.useEffect(()=>{if(video.current){if(paused||!s.preferences.enabled)video.current.pause();else void video.current.play().catch(()=>{});}},[paused,url,s.preferences.enabled]);if(!seat||!url||!record||!s.preferences.enabled||paused&&record.type==='gif')return null;return ReactDOM.createPortal(h('div',{className:'zs-background','aria-hidden':true,style:{opacity:record.opacity,filter:'blur('+record.blur+'px)'}},record.type==='video'?h('video',{ref:video,src:url,muted:true,loop:true,playsInline:true,preload:'metadata',style:{objectFit:record.fit},onError:()=>setPaused(true)}):h('img',{src:url,alt:'',style:{objectFit:record.fit}})),seat);}
 function watchWechatStatus(control,onState,onError){
  let stopped=false,flight=false;const controller=new AbortController();
  const poll=async()=>{if(stopped||flight||document.hidden)return;flight=true;try{const next=await control('wechatStatus',{},controller.signal);if(!stopped)onState(next);}catch(e){if(!stopped)onError(e);}finally{flight=false;}};
  const timer=setInterval(()=>void poll(),5000);const focus=()=>void poll();window.addEventListener('focus',focus);
  return ()=>{stopped=true;controller.abort();clearInterval(timer);window.removeEventListener('focus',focus);};
 }
 function WechatModelPicker({control}){
 const [capError,setCapError]=React.useState(''),[capabilities,setCapabilities]=React.useState(null),[catalog,setCatalog]=React.useState(null),[selection,setSelection]=React.useState(''),[effort,setEffort]=React.useState(''),[saved,setSaved]=React.useState(null),[busy,setBusy]=React.useState(false),[note,setNote]=React.useState(''),[error,setError]=React.useState('');const alive=React.useRef(true),generation=React.useRef(0);
 const refresh=async()=>{const n=++generation.current;setError('');try{const [c,s]=await Promise.all([control('modelCatalog'),control('wechatModel')]);if(alive.current&&n===generation.current){setCatalog(c);setSaved(s);setSelection(s.route?JSON.stringify({provider:s.route.provider,model:s.route.model}):'');setEffort(s.route?.reasoningEffort??'');}}catch(e){if(alive.current&&n===generation.current){setError(e.message);setCatalog({providers:[],failures:[]});}}};
 React.useEffect(()=>{alive.current=true;void refresh();return ()=>{alive.current=false;generation.current++;};},[control]);
 React.useEffect(()=>{let active=true;setCapabilities(null);setCapError('');if(selection){const route=JSON.parse(selection);control('modelCapabilities',route).then(value=>{if(active)setCapabilities(value);}).catch(()=>{if(active)setCapError('思考强度读取失败，请刷新列表。');});}return()=>{active=false;};},[selection,control,catalog]);
 const save=async()=>{if(busy||!selection)return;generation.current++;setBusy(true);setError('');setNote('');try{const r=await control('setWechatModel',{route:{...JSON.parse(selection),...(effort?{reasoningEffort:effort}:{})}});if(alive.current){setSaved(r);setNote(r.applied?'已应用到当前微信对话，后续新建微信对话也使用此模型。':'已保存，下一次新建微信对话时使用此模型。');}}catch(e){if(alive.current)setError(e.message);}finally{if(alive.current)setBusy(false);}};
   const selected=selection?JSON.parse(selection):null,model=catalog?.providers.find(p=>p.id===selected?.provider)?.models.find(m=>m.id===selected?.model),efforts=((capabilities&&selected&&capabilities.provider===selected.provider&&capabilities.model===selected.model?capabilities.reasoning:null)??model?.reasoning)?.efforts??[];
return h('section',{className:'zs-wechat-model'},h('label',{className:'zs-form-field'},'微信对话模型',h('select',{'aria-label':'微信对话模型',value:selection,disabled:busy||!catalog,onChange:e=>{generation.current++;setSelection(e.target.value);setEffort('');setNote('');}},h('option',{value:''},catalog?(catalog.providers.length?'选择模型':'暂无可用模型，可刷新重试'):'正在读取模型…'),selection&&!catalog?.providers.some(p=>p.models.some(m=>JSON.stringify({provider:p.id,model:m.id})===selection))?h('option',{value:selection},'已保存模型（当前不可用）'):null,...(catalog?.providers??[]).map(p=>h('optgroup',{key:p.id,label:p.name||p.id},...p.models.map(m=>h('option',{key:m.id,value:JSON.stringify({provider:p.id,model:m.id})},m.name||m.id)))))),h('label',{className:'zs-form-field'},'思考强度',h('select',{'aria-label':'微信思考强度',value:effort,disabled:busy||!efforts.length,onChange:e=>{generation.current++;setEffort(e.target.value);setNote('');}},h('option',{value:''},efforts.length?'跟随模型默认':capError?'读取失败，请刷新':selection&&!capabilities?'正在读取强度…':'此模型未提供可选强度'),...efforts.map(e=>h('option',{key:e.id,value:e.id},e.name||e.id)))),h('div',{className:'zw-row-actions'},h('button',{type:'button',disabled:busy||!selection,onClick:save},busy?'保存中…':'应用模型'),h('button',{type:'button',disabled:busy,onClick:refresh},'刷新列表')),h('small',null,'应用到当前已连接的微信对话；没有微信对话时供新建对话使用。切换当前对话也会按DSH规则更新部署默认模型。'),note?h('p',{role:'status'},note):null,error?h('p',{role:'alert',className:'zw-error'},error):null);
 }
 function DeleteSessionItem({sessionId,displayTitle,useMenuOpenState,ctx,store}){
 const [,close]=useMenuOpenState();const native=ctx.get('workspaces')?.list;const source=React.useMemo(()=>({subscribe:listener=>native?native.subscribe(listener):()=>{},snapshot:()=>native?.getSnapshot()??null}),[native]);const snap=React.useSyncExternalStore(source.subscribe,source.snapshot,source.snapshot);if(!snap?.archivedSessionIds?.includes(sessionId))return null;
 return h(MenuItemButton,{onSelect:()=>{close(false);window.dispatchEvent(new CustomEvent('ui-stronger-delete-session',{detail:{sessionId,title:displayTitle||'此对话'}}));}},h('span',{className:'zs-delete-label'},h('svg',{viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:1.5,'aria-hidden':true},h('path',{d:'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 10v7M14 10v7'})),'删除会话'));
 }
 function DeleteSessionDialog({control,store}){
  const [target,setTarget]=React.useState(null),[busy,setBusy]=React.useState(false),[error,setError]=React.useState('');
  const writing=React.useRef(false),alive=React.useRef(true);
  React.useEffect(()=>{alive.current=true;const open=e=>{if(typeof e.detail?.sessionId==='string'&&!writing.current){setTarget(e.detail);setError('');}};window.addEventListener('ui-stronger-delete-session',open);return()=>{alive.current=false;window.removeEventListener('ui-stronger-delete-session',open);};},[]);
  const close=()=>{if(!writing.current)setTarget(null);};
  const remove=async()=>{
   if(writing.current||!target)return;writing.current=true;setBusy(true);setError('');
   try{await control('deleteArchivedSession',{sessionId:target.sessionId,confirm:target.sessionId});store.removeSession?.(target.sessionId);void store.refresh();if(alive.current)setTarget(null);}
   catch(e){if(alive.current)setError(e.message);}
   finally{writing.current=false;if(alive.current)setBusy(false);}
  };
  return h(Modal,{headless:true,className:'zs-delete-dialog',open:!!target,title:'删除会话？',onClose:close},
   h('div',{className:'zs-delete-body'},h('h2',null,'删除会话？'),h('p',null,'“'+(target?.title??'此对话')+'”将从对话列表移除。'),h('p',{className:'zs-delete-copy'},'原始日志保留，停用插件后可能重新显示。'),error?h('p',{role:'alert',className:'zs-delete-error'},error):null),
   h('footer',{className:'zs-delete-actions'},h(Button,{variant:'outline',disabled:busy,onClick:close},'取消'),h(Button,{variant:'outline',className:'zs-delete-confirm',disabled:busy,onClick:()=>void remove()},busy?'删除中…':'删除会话')));
 }
 function DeletedRow({sessionId,store}){const state=useState(store),ref=React.useRef(null);React.useEffect(()=>{const row=ref.current?.closest('.wnFoaW_sessionRow,.wnFoaW_searchResultRow');if(!row)return;row.toggleAttribute('data-zs-deleted',state.deletedSessions?.includes(sessionId)??false);return ()=>row.removeAttribute('data-zs-deleted');},[state.deletedSessions,sessionId]);return h('span',{ref,hidden:true});}
 function snapshotView(source,derive,changes,changeKey=state=>state.deletedSessions??[]){
  const key=typeof source?.getSnapshot==='function'?'getSnapshot':typeof source?.getState==='function'?'getState':null;
  if(!key)return ()=>{};
  const original=source[key],subscribe=source.subscribe;
  let active=true;const subscriptions=new Set();
  function read(...args){const value=original.apply(this,args);return active?derive(value):value;}
  source[key]=read;
  function listen(listener,...args){
   const off=subscribe.call(this,listener,...args);
   if(!active)return off;
   let revision=JSON.stringify(changeKey(changes.snapshot()));
   const extra=changes.subscribe(()=>{const next=JSON.stringify(changeKey(changes.snapshot()));if(next!==revision){revision=next;listener();}});
   subscriptions.add(extra);return ()=>{off?.();extra();subscriptions.delete(extra);};
  }
  if(changes&&typeof subscribe==='function')source.subscribe=listen;
  return ()=>{active=false;for(const dispose of [...subscriptions])dispose();if(source[key]===read)source[key]=original;if(source.subscribe===listen)source.subscribe=subscribe;};
 }
 function wireSessionVisibility(ctx,store){
  ctx.inject(['sessions'],scope=>scope.effect(()=>{
   const source=scope.get('sessions')?.list;
   let previous,key='',cached;
   return snapshotView(source,value=>{
    const ids=store.snapshot().deletedSessions??[],next=JSON.stringify(ids);
    if(previous===value&&key===next)return cached;
    previous=value;key=next;
    if(!ids.length||!Array.isArray(value?.ids)||!value.byId)return cached=value;
    const removed=new Set(ids);
    return cached={...value,ids:value.ids.filter(id=>!removed.has(id)),byId:Object.fromEntries(Object.entries(value.byId).filter(([id])=>!removed.has(id)))};
   },store);
  },'ui-stronger: deleted sessions leave native counts'));
 }
 function archivedView(source,store){
  let previous,previousRemoved,cached;
  return snapshotView(source,value=>{
   const state=store?.snapshot();
   const removed=state?.preferences?.enabled!==false&&(state?.workbench?.looseFolder?.removed??false);
   if(previous===value&&previousRemoved===removed)return cached;
   previous=value;previousRemoved=removed;
   const flat=value?.archivedFilter==='only';
   if(!flat&&!removed)return cached=value;
   return cached={...value,...flat?{groupBy:'flat'}:{},...removed?{groupExpansion:{...value.groupExpansion,'':true}}:{}};
  },store,state=>[state.preferences?.enabled!==false,state.workbench?.looseFolder?.removed??false]);
 }
 function workspaceViewStore(ctx,name='sidebar.workspaces'){
  const entry=ctx.slots.entriesOfSlot(name)[0];
  const handle=entry?.store??entry?.options?.store;
  if(!handle||typeof ctx.slots.resolveStore!=='function')return null;
  try{return ctx.slots.resolveStore(handle);}catch{return null;}
 }
 function wireArchiveView(ctx,store){ctx.effect(()=>{
  let source,restore=()=>{};
  const attach=()=>{const next=workspaceViewStore(ctx);if(!next||next===source)return;restore();source=next;restore=archivedView(source,store);};
  const off=ctx.slots.subscribe('sidebar.workspaces',attach);attach();
  return ()=>{off();restore();};
 },'ui-stronger: archived conversations use a flat native list');}
 function ArchiveVisibility({ctx,store}){
  const state=useState(store),[seat,setSeat]=React.useState(null),[filter,setFilter]=React.useState('default');
  React.useEffect(()=>{if(!state.preferences.enabled)return;let owned=null;const sync=()=>{const root=document.querySelector('.GAkraW_root');if(!root)return;if(owned?.parentElement===root)return;owned?.remove();owned=document.createElement('div');owned.className='zs-archive-seat';root.prepend(owned);setSeat(owned);};sync();const observer=new MutationObserver(sync);observer.observe(document.body,{childList:true,subtree:true});return ()=>{observer.disconnect();owned?.remove();setSeat(null);};},[state.preferences.enabled]);
  React.useEffect(()=>{if(!seat)return;const instance=workspaceViewStore(ctx),source=[instance,instance?.store,instance?.state].find(x=>typeof x?.subscribe==='function'&&(typeof x?.getSnapshot==='function'||typeof x?.getState==='function'));if(!source)return;const sync=()=>{const snapshot=source.getSnapshot?.()??source.getState?.();if(['default','only','show'].includes(snapshot?.archivedFilter))setFilter(snapshot.archivedFilter);};sync();const off=source.subscribe(sync);return ()=>off();},[ctx,seat]);
  const choose=value=>{const instance=workspaceViewStore(ctx);if(instance?.actions?.setArchivedFilter){instance.actions.setArchivedFilter(value);setFilter(value);}};
  return seat&&state.preferences.enabled?ReactDOM.createPortal(h('div',{className:'zs-archive-filter','aria-label':'对话归档筛选'},...[[ 'default','对话'],['only','已归档']].map(([value,label])=>h('button',{type:'button',key:value,'aria-pressed':filter===value,onClick:()=>choose(value)},label))),seat):null;
 }
 function WechatMemoryScope({control,enabled,ids,onChange,disabled,allowedCwds,availableCwds}){
  const mode=!enabled?'off':ids===null?'all':'selected';
  const [rows,setRows]=React.useState([]),[next,setNext]=React.useState(null),[loading,setLoading]=React.useState(false),[error,setError]=React.useState('');
  const alive=React.useRef(false),generation=React.useRef(0);
  const load=async(offset=0)=>{
   const request=++generation.current;
   setLoading(true);setError('');
   try{
    const page=await control('wechatMemorySessions',{offset});
    if(!alive.current||request!==generation.current)return;
    setRows(previous=>offset?[...new Map([...previous,...page.items].map(row=>[row.id,row])).values()]:page.items);
    setNext(page.next);
   }catch(e){if(alive.current&&request===generation.current)setError(e.message);}
   finally{if(alive.current&&request===generation.current)setLoading(false);}
  };
  React.useEffect(()=>{alive.current=true;return ()=>{alive.current=false;generation.current++;};},[]);
  const availableKey=JSON.stringify(availableCwds);
  React.useEffect(()=>{if(mode==='selected')void load();},[mode,control,availableKey]);
  const selected=ids??[];
  const allowedKey=JSON.stringify(allowedCwds),selectedKey=JSON.stringify(ids);
  React.useEffect(()=>{
   const revoked=new Set(rows.filter(row=>!allowedCwds.includes(row.cwd)).map(row=>row.id));
   if(ids?.some(id=>revoked.has(id)))onChange(enabled,ids.filter(id=>!revoked.has(id)));
  },[allowedKey,rows,enabled,selectedKey]);
  const visible=rows.filter(row=>allowedCwds.includes(row.cwd));
  const change=id=>onChange(true,selected.includes(id)?selected.filter(value=>value!==id):[...selected,id]);
  return h('section',{className:'zs-wechat-memory'},
   h('label',{className:'zs-form-field'},'记忆互通',h('select',{'aria-label':'微信记忆互通范围',disabled,value:mode,onChange:e=>{const value=e.target.value;onChange(value!=='off',value==='all'?null:value==='selected'?(ids??[]):ids);}},h('option',{value:'off'},'关闭'),h('option',{value:'selected'},'指定桌面对话'),h('option',{value:'all'},'全部桌面对话'))),
   mode==='selected'?h(React.Fragment,null,
    h('fieldset',{className:'zs-memory-choices',disabled},h('legend',null,'互通会话 · '+selected.length+' 个'),
     ...visible.map(row=>h('label',{key:row.id,title:row.id},h('input',{type:'checkbox',checked:selected.includes(row.id),onChange:()=>change(row.id)}),h('span',null,row.title,h('small',null,row.cwd.split(/[\\/]/).pop()+' · '+row.id.slice(0,8))))),
     ...selected.filter(id=>!visible.some(row=>row.id===id)).map(id=>h('label',{key:id,title:id},h('input',{type:'checkbox',checked:true,onChange:()=>change(id)}),h('span',null,'已选会话 · '+id.slice(0,12),h('small',null,'尚未载入或工作区已移除')))),
     loading?h('p',{role:'status'},'正在读取会话…'):!rows.length&&!error?h('p',{className:'zs-subtle'},'允许的工作区内暂无桌面对话。'):null),
    error?h('p',{role:'alert',className:'zw-error'},error):null,
    error?h('button',{type:'button',disabled:loading||disabled,onClick:()=>void load()},'重试'):next!==null?h('button',{type:'button',disabled:loading||disabled,onClick:()=>void load(next)},'更多会话'):null,
    h('p',{className:'zs-subtle'},'只互通所选会话确认的记忆和同工作区历史。没有来源标记的旧记忆仅在“全部桌面对话”中共享。')):null,
   h('p',{className:'zs-subtle'},'历史检索需另行开启，工作区权限继续生效。收紧范围立即限制后续读取；新增记忆随新会话、压缩或刷新载入。已进入旧对话的文字仍会保留。'));
 }
 function WechatOutboxSettings({control,sessionId}){
  const [data,setData]=React.useState(null),[busy,setBusy]=React.useState(false),[error,setError]=React.useState('');
  const alive=React.useRef(true);
  React.useEffect(()=>{alive.current=true;control('wechatOutbox').then(value=>{if(alive.current)setData(value);}).catch(error=>{if(alive.current)setError(error.message);});return()=>{alive.current=false;};},[control]);
  const enabled=!!data?.sessionIds.includes(sessionId);
  const change=async checked=>{setBusy(true);setError('');try{const ids=data.sessionIds.filter(id=>id!==sessionId);if(checked)ids.push(sessionId);const next=await control('configureWechatOutbox',{sessionIds:ids});if(alive.current)setData(next);}catch(error){if(alive.current)setError(error.message);}finally{if(alive.current)setBusy(false);}};
  return h('details',null,h('summary',null,'主动发送'),h('label',{className:'zw-row-actions'},h('input',{type:'checkbox',checked:enabled,disabled:busy||!data||!sessionId,onChange:event=>void change(event.target.checked)}),'允许当前会话主动通知本人微信'),h('p',{className:'zs-subtle'},'模型在执行任务时可发送进度、结果或阻碍，继续经过执行审查。支持文字、图片、MP4与音频文件，音频以附件发送。需要有效微信会话令牌；空闲或关闭DSH时不会独立运行。'),h('p',{role:'alert',className:'zw-error'},error),...(data?.deliveries??[]).slice(-5).reverse().map(row=>h('p',{key:row.id,className:'zs-subtle'},new Date(row.at).toLocaleString()+' · '+row.kind+' · '+(row.status==='accepted'?'接口已接受':'投递待核对'))));
 }
 function WechatPanel({control,navigation,sessionId}){
  const [state,setState]=React.useState(null),[saveNote,setSaveNote]=React.useState(''),[cwd,setCwd]=React.useState(''),[allowed,setAllowed]=React.useState([]),[share,setShare]=React.useState(false),[memoryIds,setMemoryIds]=React.useState(null),[folders,setFolders]=React.useState([]),[qr,setQr]=React.useState(null),[error,setError]=React.useState(''),[busy,setBusy]=React.useState(false),[pairing,setPairing]=React.useState(false),[code,setCode]=React.useState('');const alive=React.useRef(true),polling=React.useRef(false);
  React.useEffect(()=>{alive.current=true;void Promise.all([control('wechatStatus'),control('workspaces')]).then(([s,w])=>{if(!alive.current)return;setState(s);setCwd(s.cwd);setAllowed(s.allowedCwds??(s.cwd?[s.cwd]:[]));setShare(s.shareMemory??false);setMemoryIds(s.memorySessionIds??null);setFolders([...new Map([...w.items,...(navigation.folders?.()??[])].map(f=>[f.cwd,f])).values()]);}).catch(e=>{if(alive.current)setError(e.message);});return ()=>{alive.current=false;};},[control]);
  const sharingKey=JSON.stringify(state?[state.shareMemory,state.memorySessionIds??null]:null);
  React.useEffect(()=>{if(state){setShare(state.shareMemory??false);setMemoryIds(state.memorySessionIds??null);}},[sharingKey]);
  const act=async(action,payload={})=>{if(busy)return;setBusy(true);setError('');setSaveNote('');try{const next=await control(action,payload);if(!alive.current)return;if(next.qr){setQr(next.qr);setPairing(true);}setState(next);if(action==='wechatConfigure')setSaveNote(payload.enabled===false&&!Object.hasOwn(payload,'allowedCwds')?'微信已停用':'设置已保存');return next;}catch(e){if(alive.current)setError(e.message);}finally{if(alive.current)setBusy(false);}};
  React.useEffect(()=>{if(!pairing)return;let disposed=false;const poll=async()=>{if(polling.current)return;polling.current=true;try{const next=await control('wechatPoll');if(disposed||!alive.current)return;setState(next);if(next.qr)setQr(next.qr);if(next.loginStatus==='verify_code_blocked')setError('配对码已失效，请重新扫码。');if(next.bound&&next.connected){setQr(null);setPairing(false);}else if(!next.login){setPairing(false);setQr(null);setError('二维码已结束，请重新绑定。');}}catch(e){if(!disposed&&alive.current){setPairing(false);setError(e.message);}}finally{polling.current=false;}};void poll();const timer=setInterval(poll,2000);return ()=>{disposed=true;clearInterval(timer);};},[pairing,control]);
  React.useEffect(()=>{if(pairing||busy)return;return watchWechatStatus(control,setState,()=>setState(s=>s?{...s,connected:false,error:'暂时无法刷新微信状态，请检查连接'}:s));},[pairing,busy,control]);
  const choices=[...folders,...allowed.filter(p=>!folders.some(f=>f.cwd===p)).map(p=>({cwd:p,label:p.split(/[\\/]/).pop()}))];
  return h(React.Fragment,null,h('p',null,state?.connected?'已连接 · 仅账号本人':'仅接受扫码绑定的账号本人。'),h(WechatModelPicker,{control}),h(WechatOutboxSettings,{control,sessionId}),h('details',null,h('summary',null,'微信控制命令'),h('p',null,'/memory 选择互通的桌面对话；/model 查看或切换模型；/sessions 列表；/switch 会话ID 切换；/archive 会话ID 归档；/restore 会话ID 恢复；/delete 会话ID 二次确认移出微信列表。DSH归档记录仍保留，不是物理删除。/help 查看说明。')),state?.lastInput?h('small',null,'最近接收：'+state.lastInput.parts+' 段 · '+state.lastInput.images+' 张图'):null,h('form',{onSubmit:e=>{e.preventDefault();setPairing(false);setQr(null);void act('wechatConfigure',{cwd,enabled:state?.enabled??false,allowedCwds:allowed,shareMemory:share,memorySessionIds:memoryIds});}},h('fieldset',{className:'zs-workspace-choices'},h('legend',null,'允许微信使用的工作区'),...choices.map(f=>h('label',{key:f.cwd,title:f.cwd},h('input',{type:'checkbox',checked:allowed.includes(f.cwd),onChange:e=>{setSaveNote('');const next=e.target.checked?[...allowed,f.cwd]:allowed.filter(value=>value!==f.cwd);setAllowed(next);if(!next.includes(cwd))setCwd(next[0]??'');}}),f.label)),h('button',{type:'button',disabled:busy,onClick:async()=>{setBusy(true);try{const f=await control('createWorkspace',{name:'default'});if(!alive.current)return;setFolders(rows=>rows.some(x=>x.cwd===f.cwd)?rows:[...rows,f]);setAllowed(rows=>rows.includes(f.cwd)?rows:[...rows,f.cwd]);setCwd(f.cwd);}catch(e){if(alive.current)setError(e.message);}finally{if(alive.current)setBusy(false);}}},'使用 DSH 默认文件夹')),
   h('label',{className:'zs-form-field'},'新微信对话的工作区',h('select',{'aria-label':'微信默认工作区',value:cwd,onChange:e=>{setSaveNote('');setCwd(e.target.value);},required:true},h('option',{value:''},'请选择'),...choices.filter(x=>allowed.includes(x.cwd)).map(f=>h('option',{key:f.cwd,value:f.cwd},f.label)))),h(WechatMemoryScope,{control,enabled:share,ids:memoryIds,allowedCwds:allowed,availableCwds:state?.allowedCwds??[],disabled:busy,onChange:(enabled,ids)=>{setSaveNote('');setShare(enabled);setMemoryIds(ids);}}),h('div',{className:'zw-row-actions'},h('button',{disabled:busy||!state||!cwd||!allowed.includes(cwd)},busy?'保存中…':'保存设置'),h('button',{type:'button',disabled:busy||!state?.enabled,onClick:()=>act('wechatLogin')},'扫码绑定'),h('button',{type:'button',disabled:busy||!state||(!state.enabled&&(!cwd||!allowed.includes(cwd))),onClick:()=>{setPairing(false);setQr(null);void act('wechatConfigure',state.enabled?{cwd:state.cwd,enabled:false}:{cwd,enabled:true,allowedCwds:allowed,shareMemory:share,memorySessionIds:memoryIds});}},state?.enabled?'停用':'启用')),saveNote?h('p',{role:'status',className:'zs-subtle'},saveNote):null),h('p',{className:'zs-subtle'},'变更默认工作区后，在微信发送 /new。已有会话保留原工作区，取消授权后拒绝继续调用。'),qr?h('div',{className:'zs-qr'},h('img',{src:qr,alt:'微信一次性绑定二维码',width:240,height:240}),h('p',null,state?.loginStatus==='scaned'?'请在手机确认。':'请用手机微信扫码。'),state?.loginStatus==='need_verifycode'?h('form',{onSubmit:e=>{e.preventDefault();const value=code;setCode('');void act('wechatPoll',{verifyCode:value});}},h('input',{type:'password','aria-label':'微信配对码',autoComplete:'one-time-code',value:code,onChange:e=>setCode(e.target.value),required:true,maxLength:32}),h('button',{disabled:busy},'提交配对码')):null):null,h('p',{role:'alert',className:'zw-error'},error||state?.error));
 }
 function FolderSymbol({kind}){
  const paths={more:'M4 12h.01M12 12h.01M20 12h.01',rename:'m4 15 11-11 5 5L9 20H4Zm9-9 5 5',delete:'M4 6h16M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7M14 10v7'};
  return h('svg',{width:16,height:16,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:kind==='more'?3:1.5,strokeLinecap:'round',strokeLinejoin:'round','aria-hidden':true},h('path',{d:paths[kind]}));
 }
 function LooseFolderControls({store,control,management=false}){
  const state=useState(store),folder=state.workbench?.looseFolder??{label:'',removed:false};
  const label=folder.label||'未分组';
  const [open,setOpen]=React.useState(false),[action,setAction]=React.useState(null),[name,setName]=React.useState(''),[busy,setBusy]=React.useState(false),[error,setError]=React.useState('');
  const alive=React.useRef(true),writing=React.useRef(false);
  React.useEffect(()=>{alive.current=true;return()=>{alive.current=false;};},[]);
  const choose=value=>{setOpen(false);setName(label);setError('');setAction(value);};
  const save=async()=>{
   if(writing.current)return;
   if(action==='rename'&&(!name.trim()||name.length>120||/[\0\r\n]/.test(name))){setError('名称须为1–120字');return;}
   writing.current=true;setBusy(true);setError('');
   try{
    const saved=await control('configureWorkbench',{looseFolder:{label:action==='rename'?name.trim():folder.label,removed:action==='delete'}});
    store.setLooseFolder(saved.looseFolder);
    await store.refresh();
    if(alive.current)setAction(null);
   }catch(e){if(alive.current)setError(e.message);}
   finally{writing.current=false;if(alive.current)setBusy(false);}
  };
  const menu=h(Menu,{open,onClose:()=>setOpen(false),items:['rename','delete'].map(kind=>({id:kind,label:h('span',{className:'zs-folder-menu-label'},h(FolderSymbol,{kind}),kind==='rename'?'重命名':'删除分组')})),onSelect:choose,align:'end',portal:true,listClassName:'zs-preset-menu-list',className:'zs-folder-seat',anchor:h('button',{type:'button',className:'zs-folder-menu-button','aria-label':'管理分组 '+label,'aria-haspopup':'menu','aria-expanded':open,disabled:busy,onClick:()=>setOpen(v=>!v)},h(FolderSymbol,{kind:'more'}))});
  return h(React.Fragment,null,
   management?h('div',{className:'zs-loose-management'},h('div',null,h('b',null,label),h('small',null,folder.removed?'分组已移除，对话直接显示':'自动收纳尚未分配工作区的对话')),folder.removed?h('button',{type:'button',disabled:busy,onClick:()=>choose('restore')},'恢复分组'):menu):menu,
   h(Modal,{className:'zs-workspace-dialog',open:!!action,title:action==='rename'?'重命名分组':action==='restore'?'恢复分组？':'删除分组？',closeLabel:'关闭',onClose:()=>{if(!writing.current)setAction(null);},footer:h(React.Fragment,null,h(Button,{variant:'outline',disabled:busy,onClick:()=>setAction(null)},'取消'),h(Button,{variant:'outline',disabled:busy||action==='rename'&&!name.trim(),onClick:()=>void save()},busy?'保存中…':action==='rename'?'保存名称':action==='restore'?'恢复分组':'删除分组'))},
    action==='rename'?h('label',{className:'zs-form-field'},'分组名称',h('input',{'aria-label':'分组名称',value:name,maxLength:120,onChange:e=>setName(e.target.value),onKeyDown:e=>{if(e.key==='Enter'){e.preventDefault();void save();}}})):h('p',null,action==='restore'?'将这些对话重新收纳到“'+label+'”分组。':'删除“'+label+'”分组后，其中的对话将直接显示在列表中。'),
    error?h('p',{role:'alert',className:'zw-error'},error):null));
 }
 function SidebarFolderActions({store,control}){
  const state=useState(store),[seat,setSeat]=React.useState(null);
  const enabled=state.preferences.enabled,folder=state.workbench?.looseFolder??{label:'',removed:false};
  React.useEffect(()=>{
   if(!enabled)return;
   let current,owned,originalTitle,appliedTitle,titleNode,createButton,originalLabel,appliedLabel;
   const restore=()=>{
    owned?.remove();
    if(titleNode&&titleNode.textContent===appliedTitle)titleNode.textContent=originalTitle;
    if(createButton&&createButton.getAttribute('aria-label')===appliedLabel){if(originalLabel===null)createButton.removeAttribute('aria-label');else createButton.setAttribute('aria-label',originalLabel);}
    current?.removeAttribute('data-zs-loose-removed');
    current=null;owned=null;titleNode=null;createButton=null;
   };
   const sync=()=>{
    const row=document.querySelector('.GAkraW_root [data-row-key="workspace:"]');
    if(row!==current){restore();setSeat(null);if(!row)return;current=row;}
    const title=current.querySelector('.wnFoaW_projectText .wnFoaW_title'),actions=current.querySelector('.wnFoaW_rowActions');
    if(title&&title!==titleNode){titleNode=title;originalTitle=title.textContent;appliedTitle=undefined;}
    if(titleNode){
     if(appliedTitle!==undefined&&titleNode.textContent!==appliedTitle)originalTitle=titleNode.textContent;
     const next=folder.label||originalTitle;
     if(titleNode.textContent!==next)titleNode.textContent=next;
     appliedTitle=next;
    }
    const button=actions?.querySelector?.('.wnFoaW_iconButton');
    if(button!==createButton){
     if(createButton&&createButton.getAttribute('aria-label')===appliedLabel){if(originalLabel===null)createButton.removeAttribute('aria-label');else createButton.setAttribute('aria-label',originalLabel);}
     createButton=button;originalLabel=button?.getAttribute('aria-label');appliedLabel=undefined;
    }
    if(createButton){
     const actual=createButton.getAttribute('aria-label');
     if(appliedLabel!==undefined&&actual!==appliedLabel)originalLabel=actual;
     const next=folder.label&&originalLabel?.includes(originalTitle)?originalLabel.replace(originalTitle,folder.label):originalLabel;
     if(next!==null&&actual!==next)createButton.setAttribute('aria-label',next);
     appliedLabel=next;
    }
    const removed=String(folder.removed);
    if(current.getAttribute('data-zs-loose-removed')!==removed)current.setAttribute('data-zs-loose-removed',removed);
    if(actions&&(!owned||owned.parentNode!==actions)){owned?.remove();owned=document.createElement('span');owned.className='zs-folder-seat';actions.prepend(owned);setSeat(owned);}
   };
   const observer=new MutationObserver(sync);observer.observe(document.body,{subtree:true,childList:true,characterData:true});sync();
   return()=>{observer.disconnect();restore();};
  },[enabled,folder.label,folder.removed]);
  return seat?ReactDOM.createPortal(h('span',{onClick:e=>e.stopPropagation(),onKeyDown:e=>e.stopPropagation()},h(LooseFolderControls,{store,control})),seat):null;
 }

 function ManagedWorkspaces({control,navigation,store}){
  const [items,setItems]=React.useState([]),[name,setName]=React.useState('default'),[busy,setBusy]=React.useState(false),[error,setError]=React.useState(''),[target,setTarget]=React.useState(null),[title,setTitle]=React.useState('');
  const alive=React.useRef(true),writing=React.useRef(false);
  const refresh=async()=>{const value=await control('workspaces');if(alive.current)setItems(value.items.filter(row=>row.workspaceId));};
  React.useEffect(()=>{alive.current=true;void refresh().catch(e=>{if(alive.current)setError(e.message);});return ()=>{alive.current=false;};},[control]);
  const choose=(row,action)=>{setTarget({...row,action});setTitle(row.label);setError('');};
  const submit=async()=>{
   if(writing.current||!target)return;writing.current=true;setBusy(true);setError('');
   try{await control('workspaceAction',{action:target.action,workspaceId:target.workspaceId,...target.action==='rename'?{title}:{confirm:target.workspaceId}});await refresh();if(alive.current)setTarget(null);}
   catch(e){if(alive.current)setError(e.message);}
   finally{writing.current=false;if(alive.current)setBusy(false);}
  };
  return h(React.Fragment,null,
   h('p',null,'管理 DSH 的工作区名称和列表。'),
   store?h(LooseFolderControls,{store,control,management:true}):null,
   h('form',{className:'zw-inline-form',onSubmit:async e=>{e.preventDefault();if(busy)return;setBusy(true);setError('');try{const row=await control('createWorkspace',{name});await navigation.adopt(row.cwd);await refresh();}catch(e){if(alive.current)setError(e.message);}finally{if(alive.current)setBusy(false);}}},h('input',{'aria-label':'新工作区名称',value:name,onChange:e=>setName(e.target.value),maxLength:48,required:true}),h('button',{disabled:busy},'创建并打开')),
   h('div',{className:'zw-entries'},...items.map(row=>h('article',{key:row.workspaceId},h('div',null,h('b',null,row.label),h('small',null,row.cwd)),h('div',{className:'zw-row-actions'},h('button',{disabled:busy,onClick:()=>navigation.adopt(row.cwd).catch(e=>setError(e.message))},'打开'),h('button',{disabled:busy,onClick:()=>choose(row,'rename')},'改名'),h('button',{disabled:busy,onClick:()=>choose(row,'delete')},'删除'))))),
   !items.length?h('p',{className:'zs-subtle'},'暂无已注册工作区。可创建工作区，或通过侧栏添加已有文件夹。“未分组”是会话的占位分组。'):null,
   h(Modal,{className:'zs-workspace-dialog',open:!!target,title:target?.action==='rename'?'工作区改名':'删除工作区？',closeLabel:'关闭',onClose:()=>{if(!busy)setTarget(null);},footer:h(React.Fragment,null,h(Button,{variant:'outline',disabled:busy,onClick:()=>setTarget(null)},'取消'),h(Button,{variant:'outline',disabled:busy||target?.action==='rename'&&!title.trim(),onClick:submit},busy?'处理中…':target?.action==='rename'?'保存名称':'删除工作区'))},target?.action==='rename'?h('label',{className:'zs-form-field'},'工作区名称',h('input',{'aria-label':'工作区名称',value:title,onChange:e=>setTitle(e.target.value),maxLength:120,onKeyDown:e=>{if(e.key==='Enter'){e.preventDefault();void submit();}}})):h('p',null,'从 DSH 列表移除“'+(target?.label??'')+'”。文件和会话记录保留，微信的目录授权单独管理。'),target&&error?h('p',{role:'alert',className:'zw-error'},error):null),
   !target&&error?h('p',{role:'alert',className:'zw-error'},error):null);
 }

 function GettingStarted({store,control,navigation}){const state=useState(store),[busy,setBusy]=React.useState(false),[error,setError]=React.useState('');const start=async()=>{setBusy(true);setError('');try{const w=await control('createWorkspace',{name:'default'});await navigation.adopt(w.cwd);}catch(e){setError(e.message);}finally{setBusy(false);}};return h('div',{className:'zs-getting-started'},h('p',null,'直接输入需求就能开始。其余能力按需开启。'),h('div',{className:'zs-start-actions'},h('button',{disabled:busy,onClick:start},busy?'准备中…':'使用默认工作区'),h('button',{onClick:()=>openTools('knowledge')},'接入自己的资料'),h('button',{onClick:()=>openTools('skills')},'管理技能')),h('details',null,h('summary',null,'如何使用'),h('p',null,'长任务可用 /context-handoff 整理进度；重复流程用 /workflow-distill 提出技能草稿。模型也可按需调用。'),h('p',null,'可信核验会让一个子智能体独立质疑候选结论，必要时修正，最多两轮，会增加模型调用和等待；证据不足会明确说明。'),h('p',null,'对话顶部的“过程”显示实际工具事件、交接和核验记录。')),h('details',null,h('summary',null,'接入与隐私'),h('p',null,'模型和订阅在 DSH 原生设置中配置。语音、桌宠和背景可选，不影响普通对话。'),h('p',null,'知识库命中片段会交给当前模型；不要接入密钥目录。微信的工作区权限和记忆共享需单独设置。')),h('p',{role:'alert',className:'zw-error'},error));}
 function ProcessPanel({store,control}){const state=useState(store),[data,setData]=React.useState(null),[error,setError]=React.useState(''),[busy,setBusy]=React.useState(false);const generation=React.useRef(0),flight=React.useRef(null);const refresh=React.useCallback(async()=>{if(flight.current?.id===state.sessionId)return;const token=++generation.current;flight.current={id:state.sessionId,token};setBusy(true);setError('');if(!state.sessionId){flight.current=null;setData(null);setBusy(false);return;}try{const next=await control('processTrace',{sessionId:state.sessionId});if(token===generation.current)setData(next);}catch(e){if(token===generation.current)setError(e.message);}finally{if(flight.current?.token===token)flight.current=null;if(token===generation.current)setBusy(false);}},[state.sessionId,control]);React.useEffect(()=>{setData(null);void refresh();const timer=setInterval(()=>{if(!document.hidden)void refresh();},3000);return ()=>{clearInterval(timer);generation.current++;flight.current=null;};},[refresh]);const verdict={superseded:'问题已更新，未完成核验',supported:'暂未发现有效反驳',challenged:'发现反例，须继续验证',inconclusive:'证据不足','awaiting-reviewer':'等待独立质疑'};return h('div',{className:'zs-process'},h('div',{className:'zw-row-actions'},h('p',null,'查看实际记录；展开时自动更新。'),h('button',{disabled:busy||!state.sessionId,onClick:refresh},busy?'读取中…':'刷新')),!data?.available?h('p',null,'先打开一个对话；没有记录时不会虚构进度。'):h(React.Fragment,null,data.requestFailure?h('aside',{className:'zs-inline-notice',role:'status'},h('b',null,data.requestFailure.title+' · '+data.requestFailure.code),h('p',null,data.requestFailure.advice)):null,data.handoff?h('details',null,h('summary',null,'任务与进度'),h('p',null,'以下是模型记录的交接摘要，完成情况仍需核对证据。'),...['goal','verified','next'].map((key,i)=>h('div',{key},h('b',null,['目标','验证记录','下一步'][i]),h('pre',null,data.handoff[key])))):null,h('details',{open:true},h('summary',null,'工具与上下文事件'),data.events.length?h('ol',null,...data.events.map(e=>h('li',{key:e.seq},h('span',null,e.label),h('small',null,e.tool||'#'+e.seq)))):h('p',null,'还没有工具事件。')),h('details',{open:!!data.reviews.length},h('summary',null,'结论核验'),data.reviews.length?data.reviews.map(r=>h('article',{key:r.id},h('b',null,verdict[r.status]||r.status),h('p',null,r.claim),r.contextMode?h('small',null,({fresh:'独立上下文',inherited:'继承历史上下文',unknown:'上下文独立性未声明'})[r.contextMode]):null,r.weaknesses?.length?h('ul',null,...r.weaknesses.map((x,i)=>h('li',{key:i},x))):null,r.checks?.length?h('details',null,h('summary',null,'待复核的检查与依据'),h('ul',null,...r.checks.map((x,i)=>h('li',{key:i},x)))):null)):h('p',null,'尚未进行独立质疑。可用 /adversarial-answer 发起。')),h('details',null,h('summary',null,'执行审查'),h('p',null,data.guard?'执行前审查已开启；DSH 原生权限继续生效。':'本插件审查未开启；请检查安全设置。'),data.lastReview?h('p',null,'最近结果：'+data.lastReview.decision+' / '+data.lastReview.risk+' · '+data.lastReview.durationMs+' ms'):h('p',null,'本会话暂未取得审查记录。')),h('p',{className:'zs-subtle'},data.note)),h('p',{role:'alert',className:'zw-error'},error));}
 function IntelligencePanel({store,control,onCompacted}){
  const current=useState(store),[data,setData]=React.useState(null),[catalog,setCatalog]=React.useState(null),[busy,setBusy]=React.useState(false),[note,setNote]=React.useState(''),[error,setError]=React.useState(''),[triggerMode,setTriggerMode]=React.useState('ratio'),[ratio,setRatio]=React.useState('75'),[tokenLimit,setTokenLimit]=React.useState('32768'),[reload,setReload]=React.useState(0);const live=React.useRef(true),generation=React.useRef(0);
  React.useEffect(()=>{live.current=true;generation.current++;let active=true;setData(null);setBusy(false);setNote('');setError('');void control('intelligence',current.sessionId?{sessionId:current.sessionId}:{}).then(v=>{if(active)setData(v);}).catch(e=>{if(active)setError(e.message);});return ()=>{active=false;live.current=false;generation.current++;};},[control,current.sessionId,reload]);
  const run=async(action,payload)=>{if(busy)return;const token=generation.current;setBusy(true);setError('');setNote('');try{const value=await control(action,action==='configureIntelligence'?{...payload,...current.sessionId?{sessionId:current.sessionId}:{}}:payload);if(!live.current||token!==generation.current)return;if(action==='compactNow'){setNote(value.changed?'已压缩 · '+formatNumber(value.before)+' → '+formatNumber(value.after)+' token；原始日志保留。':'暂无可压缩历史。');void onCompacted();}else {setData(value);setNote('已保存，后续模型步骤生效。');}}catch(e){if(live.current&&token===generation.current)setError(e.message);}finally{if(live.current&&token===generation.current)setBusy(false);}};
  React.useEffect(()=>{
   if(!data)return;
   setTriggerMode(data.context.triggerMode??'ratio');setRatio(String(Math.round(data.context.thresholdRatio*1000)/10));setTokenLimit(String(data.context.thresholdTokens??32768));
  },[data?.context.triggerMode,data?.context.thresholdRatio,data?.context.thresholdTokens]);
  if(!data)return h(PanelLoadState,{message:'读取上下文策略…',error,onRetry:()=>setReload(value=>value+1)});
  const context=data.context,roles=[['subagent','子智能体'],['search','搜索与资料研究'],['operations','操作与执行'],['summary','上下文摘要']];
  const loadCatalog=async e=>{if(!e.currentTarget.open||catalog)return;try{const value=await control('modelCatalog');if(live.current)setCatalog(value);}catch(e){if(live.current&&token===generation.current)setError(e.message);}};
  return h('div',{className:'zs-intelligence'},h('div',{className:'zs-context-intro'},h('div',null,h('b',null,'保持连续，按需回忆'),h('p',null,'保留原始会话，用交接摘要与按需检索延续长任务。')),h('button',{disabled:busy||!current.sessionId||!data.capabilities.manual,onClick:()=>run('compactNow',{sessionId:current.sessionId})},busy?'处理中…':'立即压缩')),
   h('label',{className:'zs-form-field'},'自动压缩',h('select',{'aria-label':'自动压缩',value:String(context.auto),disabled:busy,onChange:e=>run('configureIntelligence',{context:{...context,auto:e.target.value==='null'?null:e.target.value==='true'}})},h('option',{value:'null'},'跟随 DSH'),h('option',{value:'true'},'自动管理'),h('option',{value:'false'},'仅手动（保留溢出恢复）'))),context.auto===true?h('form',{className:'zs-compression-trigger',onSubmit:event=>{
    event.preventDefault();
    void run('configureIntelligence',{context:{...context,triggerMode,...triggerMode==='ratio'?{thresholdRatio:Number(ratio)/100}:{thresholdTokens:Number(tokenLimit)}}});
   }},
    h('label',{className:'zs-form-field'},'触发方式',h('select',{'aria-label':'上下文压缩触发方式',value:triggerMode,disabled:busy,onChange:e=>setTriggerMode(e.target.value)},h('option',{value:'ratio'},'按模型上下文百分比'),h('option',{value:'tokens'},'固定 Token 数'))),
    triggerMode==='ratio'?h('label',{className:'zs-form-field'},'触发比例（%）',h('input',{type:'number','aria-label':'上下文压缩触发百分比',min:50,max:90,step:.1,required:true,value:ratio,disabled:busy,onChange:e=>setRatio(e.target.value)})):h('label',{className:'zs-form-field'},'触发 Token 数',h('input',{type:'number','aria-label':'上下文压缩触发Token数',min:4096,max:16000000,step:1,required:true,value:tokenLimit,disabled:busy,onChange:e=>setTokenLimit(e.target.value)})),
    h('div',{className:'zw-row-actions'},h('button',{type:'submit',disabled:busy},busy?'保存中…':'应用阈值')),
    h('p',{className:'zs-subtle',role:'status'},data.compression?.effectiveTokens!=null?'已保存阈值约 '+formatNumber(data.compression.effectiveTokens)+' tokens / 模型容量 '+formatNumber(data.compression.capacity)+' tokens'+(data.compression.limited?'，已按输出预留和安全余量调整。':'。'):data.compression?.reason||'打开实际会话后显示当前模型的生效阈值。')):null,
   h('details',{className:'zs-compression-notes'},h('summary',null,'压缩与原文保留说明'),h('p',{className:'zs-subtle'},'自动管理按最近原文目标、20% 消息预算和触发阈值的一半中较小者保留；完整工具配对可能超出目标，实际阈值也受输出预留影响。摘要会调用模型并产生用量。恢复精确细节时按需查原文，不把摘要当作新授权。')),
   context.auto===true?h('label',{className:'zs-form-field'},'最近原文目标预算',h('select',{'aria-label':'最近原文目标预算',value:context.tailTokens??16384,disabled:busy,onChange:e=>run('configureIntelligence',{context:{...context,tailTokens:Number(e.target.value)}})},...[8192,16384,32768,65536].map(n=>h('option',{key:n,value:n},(n/1024)+'K tokens')))):null,
   h('details',{onToggle:loadCatalog},h('summary',null,'按任务分配模型'),h('p',null,'未指定时沿用当前模型。搜索、操作表示负责该任务的智能体模型，搜索服务与命令工具仍由 DSH 提供。切换提供商会改变数据接收方，并可能降低缓存命中。'),h('label',{className:'zw-row-actions'},h('input',{type:'checkbox',checked:data.routingEnabled,disabled:busy,onChange:e=>run('configureIntelligence',{routingEnabled:e.target.checked})}),'启用任务模型分配'),...roles.map(([key,label])=>h('label',{key,className:'zs-form-field'},label,h('select',{'aria-label':label+'模型',value:data.routes[key]?JSON.stringify(data.routes[key]):'',disabled:busy||!catalog,onChange:e=>run('configureIntelligence',{routes:{[key]:e.target.value?JSON.parse(e.target.value):null}})},h('option',{value:''},'沿用当前模型'),data.routes[key]&&!catalog?.providers.some(p=>p.id===data.routes[key].provider&&p.models.some(m=>m.id===data.routes[key].model))?h('option',{value:JSON.stringify(data.routes[key])},data.routes[key].model+'（当前未列出）'):null,...(catalog?.providers??[]).map(p=>h('optgroup',{key:p.id,label:p.name},...p.models.map(m=>h('option',{key:m.id,value:JSON.stringify({provider:p.id,model:m.id})},m.name||m.id))))))),h('label',{className:'zs-form-field'},'当前会话任务类型',h('select',{'aria-label':'当前会话任务类型',disabled:busy||!current.sessionId||!data.routingEnabled,value:data.tasks[current.sessionId]??'conversation',onChange:e=>run('taskProfile',{sessionId:current.sessionId,kind:e.target.value})},...[['conversation','常规对话'],['search','搜索与研究'],['operations','操作与执行'],['subagent','子任务']].map(([k,label])=>h('option',{key:k,value:k},label)))),h('p',null,'模型可用 workspace_task_profile 为自身选择已配置类型。子智能体默认使用子任务模型；安全审查与摘要独立分配，不削弱原生权限。')),
   h('p',{role:'status'},note),h('p',{role:'alert',className:'zw-error'},error));
 }
 function NativeModelsPanel({store,control,navigation}){
  const current=useState(store),[access,setAccess]=React.useState(null),[catalog,setCatalog]=React.useState(null),[status,setStatus]=React.useState(null),[errors,setErrors]=React.useState({}),[busy,setBusy]=React.useState(false),[notice,setNotice]=React.useState(''),[loading,setLoading]=React.useState(true);
  const generation=React.useRef(0),writes=React.useRef(0),writing=React.useRef(false),reload=React.useRef(()=>{});
  React.useEffect(()=>{
   const epoch=++generation.current,controller=new AbortController(),pending={};let closed=false;setStatus(null);setErrors({});setBusy(false);writing.current=false;setNotice('');
   const read=async(action,setter,payload={})=>{if(pending[action]||closed||action==='modelAccess'&&writing.current)return;pending[action]=true;const revision=writes.current;if(action==='modelCatalog')setLoading(true);
    try{const value=await control(action,payload,controller.signal);if(epoch===generation.current&&(action!=='modelAccess'||!writing.current&&revision===writes.current)){setter(value);setErrors(old=>({...old,[action]:''}));}}
    catch(e){if(!controller.signal.aborted&&epoch===generation.current&&(action!=='modelAccess'||revision===writes.current))setErrors(old=>({...old,[action]:e.message}));}
    finally{pending[action]=false;if(action==='modelCatalog'&&epoch===generation.current)setLoading(false);}
   };
   const refresh=withCatalog=>{if(withCatalog)void read('modelCatalog',setCatalog);void read('modelStatus',setStatus,{sessionId:current.sessionId});void read('modelAccess',setAccess);};
   reload.current=()=>refresh(true);refresh(true);
   const focus=()=>{if(!document.hidden)refresh(true);};window.addEventListener('focus',focus);document.addEventListener('visibilitychange',focus);
   const timer=setInterval(()=>{if(!document.hidden)refresh(false);},15000);return ()=>{closed=true;++generation.current;controller.abort();clearInterval(timer);window.removeEventListener('focus',focus);document.removeEventListener('visibilitychange',focus);};
  },[control,current.sessionId]);
  const label=r=>r?r.provider+' / '+r.model:'尚未取得';
  const toggle=async(provider,model,enabled)=>{if(writing.current)return;const epoch=generation.current;writing.current=true;++writes.current;setBusy(true);setErrors({});setNotice('');try{const value=await control('setModelAccess',{provider,...model?{model}:{},enabled});if(epoch===generation.current){setAccess(value);setNotice(enabled?'调用已开启。':'后续调用已停用。');}}catch(e){if(epoch===generation.current)setErrors({write:e.message});}finally{if(epoch===generation.current){++writes.current;writing.current=false;setBusy(false);}}};
  const isAllowed=(provider,model)=>!!access&&!access.providers.includes(provider)&&!access.models.some(r=>r.provider===provider&&r.model===model),next=status?.override??status?.next;
  const reveal=e=>{const node=e.currentTarget;if(!node.open)return;requestAnimationFrame(()=>{if(!node.isConnected||!node.open)return;const panel=node.closest('.zw-panel');if(!panel)return;const row=node.getBoundingClientRect(),frame=panel.getBoundingClientRect();if(row.height<=panel.clientHeight-24&&row.bottom>frame.bottom-16)panel.scrollBy({top:row.bottom-frame.bottom+16,behavior:'instant'});});};
  return h('section',{className:'zw-panel zw-workspace zs-models-panel'},
   h('div',{className:'zs-model-toolbar'},h('div',null,h('span',{className:'zs-caption'},'模型与连接'),h('p',null,'切换模型，请使用对话输入框。')),h('button',{className:'zs-primary-action',onClick:()=>{try{navigation.models();}catch(e){setErrors({navigation:e.message});}}},'配置供应商',h(NavIcon,{kind:'arrow'}))),
   h('div',{className:'zs-current-model'},h('span',{className:'zs-caption'},'下次请求'),h('strong',null,next?.model??(status?'尚未选择模型':'读取当前选择…')),h('span',{className:'zs-provider-caption'},next?.provider??'等待 DSH 配置')),
   status?h('details',{className:'zs-model-details'},h('summary',null,'选择详情'),h('dl',{className:'zs-model-state'},h('dt',null,'最后实际请求'),h('dd',null,label(status.last)),h('dt',null,'新会话默认'),h('dd',null,label(status.default))),status.override?h('p',null,'任务分配：'+status.task+'。在上下文页调整。'):null):null,
   h('div',{className:'zs-model-refresh'},h('span',{role:'status'},loading?'正在读取目录…':catalog?catalog.providers.length+' 个供应商':'供应商'),h('button',{disabled:loading||busy,onClick:()=>reload.current()},'刷新目录')),
   ...(catalog?.providers??[]).map(p=>h('details',{key:p.id,className:'zs-model-provider',onToggle:reveal},h('summary',null,h('span',null,p.name||p.id),h('small',null,p.models.length+' 个模型')),h('div',{className:'zs-provider-access'},h('div',null,h('span',null,'供应商调用'),p.name&&p.name!==p.id?h('small',null,p.id):null),h('button',{role:'switch','aria-label':'供应商 '+p.id+' 调用开关','aria-checked':!!access&&!access.providers.includes(p.id),disabled:busy||!access,onClick:()=>toggle(p.id,undefined,access.providers.includes(p.id))})),...p.models.map(m=>h('div',{key:m.id,className:'zs-model-access-row'},h('span',null,m.name||m.id),h('button',{role:'switch','aria-label':'模型 '+p.id+' / '+m.id+' 调用开关','aria-checked':isAllowed(p.id,m.id),disabled:busy||!access||access.providers.includes(p.id),onClick:()=>toggle(p.id,m.id,!isAllowed(p.id,m.id))}))))),
   catalog?.failures.length?h('p',{role:'status',className:'zs-inline-notice'},'目录暂不可用：'+catalog.failures.map(p=>p.name||p.id).join('、')+'。其余模型可继续使用。'):null,
   catalog&&!catalog.providers.length&&!loading?h('p',null,'暂无可用模型，请检查配置或刷新目录。'):null,
   h('p',{className:'zs-footnote'},'停用仅拦截后续调用；配置保留，已开始的请求不受影响。'),
   notice?h('p',{role:'status',className:'zs-inline-notice'},notice):null,...Object.entries(errors).filter(([,message])=>message).map(([key,message])=>h('p',{key,role:'alert',className:'zw-error'},message)));
 }
 function WorkbenchPanel({store,control,navigation,tab}){
  const state=useState(store),panels=useCatalog(navigation),[data,setData]=React.useState(null),[modules,setModules]=React.useState([]),[error,setError]=React.useState(''),[notice,setNotice]=React.useState(''),[busy,setBusy]=React.useState(false),[usage,setUsage]=React.useState(null),[background,setBackground]=React.useState(null),[query,setQuery]=React.useState(''),[results,setResults]=React.useState(null),[reload,setReload]=React.useState(0);const alive=React.useRef(true),backgroundFlight=React.useRef(false);
  React.useEffect(()=>{alive.current=true;let cancelled=false;setData(null);setError('');setNotice('');void control('workbench').then(v=>{if(!cancelled){setData(v);setModules(v.modules);}}).catch(e=>{if(!cancelled)setError(e.message);});if(tab==='background')void backgroundRecord().then(v=>{if(!cancelled)setBackground(v??null);}).catch(e=>{if(!cancelled)setError(e.message);});return ()=>{cancelled=true;alive.current=false;};},[tab,control,reload]);
  const run=async(action,payload={})=>{if(busy)return;setBusy(true);setError('');setNotice('');try{const result=await control(action,payload);if(!alive.current)return;if(action==='configureWorkbench'){setData(result);await store.refresh();setNotice('已保存到本机。');}if(action==='contextUsage'&&result.sessionId===store.snapshot().sessionId)setUsage(result);if(action==='searchHistory')setResults(result);if(action==='refreshMemory')setNotice('本会话将在下一个模型步骤使用最新记忆。');return result;}catch(e){if(alive.current)setError(e.message);}finally{if(alive.current)setBusy(false);}};
  React.useEffect(()=>{
   setUsage(null);if(tab!=='context'||!state.sessionId)return;
   let active=true,pending=false;const controller=new AbortController();
   const refresh=async()=>{
    if(!active||pending||document.hidden)return;pending=true;
    try{const value=await control('contextUsage',{sessionId:state.sessionId},controller.signal);if(active&&value.sessionId===store.snapshot().sessionId)setUsage(value);}
    catch(e){if(active&&!controller.signal.aborted)setError(e.message);}
    finally{pending=false;}
   };
   void refresh();const timer=setInterval(refresh,5000);document.addEventListener('visibilitychange',refresh);
   return()=>{active=false;controller.abort();clearInterval(timer);document.removeEventListener('visibilitychange',refresh);};
  },[tab,state.sessionId,control]);
  const saveBackground=async(value,{fromFile=false}={})=>{
   if(backgroundFlight.current)return;
   backgroundFlight.current=true;setBusy(true);setError('');setNotice('');
   try{
    const next=fromFile?await inspectBackground(value):value;
    await backgroundRecord(next);
    window.dispatchEvent(new CustomEvent('ui-stronger-background'));
    if(alive.current){setBackground(next);setNotice(next?'已保存本机背景。':'已移除背景。');}
   }catch(e){if(alive.current)setError(e.message||'无法保存背景，可能空间不足');}
   finally{backgroundFlight.current=false;if(alive.current)setBusy(false);}
  };
  const moduleChange=(id,patch)=>setModules(rows=>rows.map(r=>r.id===id?{...r,...patch}:r));
  if(!data&&['modules','history'].includes(tab))return h('section',{className:'zw-panel zw-workspace'},h(PanelLoadState,{message:'读取工作台设置…',error,onRetry:()=>setReload(value=>value+1)}));
  let body;
  if(tab==='start')body=h(GettingStarted,{store,control,navigation});
  else if(tab==='process')body=h(ProcessPanel,{store,control});
  else if(tab==='workspaces')body=h(ManagedWorkspaces,{control,navigation,store});
  else if(tab==='modules')body=h(React.Fragment,null,h('p',null,'编辑首页工作模块的标题、内容、顺序和可见性。提示词模块只放入输入框，由你决定是否发送。'),h('div',{className:'zs-module-settings'},...modules.map((r,i)=>h('article',{key:r.id,className:'zs-module-row'},h('div',null,h('input',{'aria-label':'模块标题 '+(i+1),value:r.title,maxLength:60,onChange:e=>moduleChange(r.id,{title:e.target.value})}),h('label',null,h('input',{type:'checkbox',checked:r.visible,onChange:e=>moduleChange(r.id,{visible:e.target.checked})}),' 显示')),h('input',{'aria-label':'模块说明 '+(i+1),value:r.detail,maxLength:160,onChange:e=>moduleChange(r.id,{detail:e.target.value})}),h('div',null,h('select',{'aria-label':'模块类型 '+(i+1),value:r.kind,onChange:e=>moduleChange(r.id,{kind:e.target.value,target:e.target.value==='panel'?panels[0]?.id??'plugins':e.target.value==='extension'?'interface':''})},h('option',{value:'panel'},'DSH 面板'),h('option',{value:'extension'},'扩展功能'),h('option',{value:'prompt'},'提示词')),r.kind==='panel'?h('select',{'aria-label':'面板目标 '+(i+1),value:r.target,onChange:e=>moduleChange(r.id,{target:e.target.value})},!panels.some(p=>p.id===r.target)?h('option',{value:r.target},r.target+'（当前不可用）'):null,...panels.map(p=>h('option',{key:p.id,value:p.id},p.label))):r.kind==='extension'?h('select',{'aria-label':'扩展目标 '+(i+1),value:r.target,onChange:e=>moduleChange(r.id,{target:e.target.value})},...[[ 'thinking','思考工作台'],['interface','界面'],['voice','语音'],['pet','桌宠'],...CAPABILITY_TABS,...WORKBENCH_TABS].map(([id,label])=>h('option',{key:id,value:id},label))):h('textarea',{'aria-label':'模块提示词 '+(i+1),value:r.target,maxLength:4000,onChange:e=>moduleChange(r.id,{target:e.target.value})})),h('div',{className:'zs-module-actions'},h('button',{disabled:i===0,onClick:()=>setModules(rows=>{const next=[...rows];[next[i-1],next[i]]=[next[i],next[i-1]];return next;})},'上移'),h('button',{disabled:i===modules.length-1,onClick:()=>setModules(rows=>{const next=[...rows];[next[i+1],next[i]]=[next[i],next[i+1]];return next;})},'下移'),h('button',{onClick:()=>setModules(rows=>rows.filter(x=>x.id!==r.id))},'移除'))))),h('div',{className:'zw-row-actions'},h('button',{disabled:busy||modules.length>=12,onClick:()=>setModules(rows=>[...rows,{id:crypto.randomUUID(),title:'新模块',detail:'',kind:'prompt',target:'',visible:true}])},'添加模块'),h('button',{disabled:busy,onClick:()=>run('configureWorkbench',{modules})},busy?'保存中…':'保存模块')));
  else if(tab==='background')body=h(React.Fragment,null,
   h('p',{className:'zs-panel-intro'},'为会话设置本机图片、GIF 或静音视频。背景仅保存在当前客户端。'),
   h(LocalFilePicker,{label:'选择会话背景',hint:'PNG / JPG / WebP / GIF / MP4 / WebM · 最大 64 MB',accept:'.png,.jpg,.jpeg,.webp,.gif,.mp4,.webm',disabled:busy,onChange:event=>{
    const input=event.currentTarget,file=input.files?.[0];input.value='';
    if(file)void saveBackground(file,{fromFile:true});
   }}),
   h('section',{className:'zs-background-settings','aria-label':'背景调整'},
    background?h(React.Fragment,null,
     h('div',{className:'zs-background-current'},h('span',null,'当前背景'),h('strong',null,background.name)),
     h('label',{className:'zs-range-field'},h('span',null,'可见度',h('output',null,Math.round(background.opacity*100)+'%')),h('input',{type:'range','aria-label':'背景可见度',min:.04,max:.35,step:.01,value:background.opacity,disabled:busy,onChange:e=>setBackground({...background,opacity:Number(e.target.value)})})),
     h('label',{className:'zs-range-field'},h('span',null,'模糊',h('output',null,background.blur+' px')),h('input',{type:'range','aria-label':'背景模糊',min:0,max:16,value:background.blur,disabled:busy,onChange:e=>setBackground({...background,blur:Number(e.target.value)})})),
     h('label',{className:'zs-form-field'},'填充方式',h('select',{'aria-label':'背景填充方式',value:background.fit,disabled:busy,onChange:e=>setBackground({...background,fit:e.target.value})},h('option',{value:'cover'},'铺满'),h('option',{value:'contain'},'完整显示'))),
     h('div',{className:'zw-row-actions'},h('button',{type:'button',disabled:busy,onClick:()=>saveBackground(background)},'应用调整'),h('button',{type:'button',disabled:busy,onClick:()=>saveBackground(null)},'移除背景'))):h('p',{className:'zs-background-empty'},'当前为纯色背景。选择文件后即可调整显示方式。')),
   h('details',{className:'zs-background-notes'},h('summary',null,'本机存储与播放说明'),h('p',null,'背景不会加入知识库或模型上下文。视频始终静音，窗口隐藏、关闭动效或系统减少动效时暂停；关闭动效时隐藏 GIF。清除当前客户端的站点数据也会移除背景。')));

  else if(tab==='context'){
   const ratio=usage?.tokens!==null&&usage?.capacity?usage.tokens/usage.capacity:null;
   const table=(rows,label)=>h(React.Fragment,null,h('h3',null,label),h('div',{className:'zs-table-scroll'},h('table',{className:'zs-usage-table'},h('thead',null,h('tr',null,...['模型 / 路由',label.includes('历史')?'回复':'请求','命中缓存','未命中缓存','输出','失败/取消'].map(x=>h('th',{key:x},x)))),h('tbody',null,...rows.map((r,i)=>h('tr',{key:i},h('td',null,r.model,h('small',{className:'zs-model-tag'},' · '+r.provider)),h('td',null,r.requests),h('td',null,cacheLabel(r)),h('td',null,(r.inputSamples??r.reported)?formatNumber(r.input):'未报告'),h('td',null,(r.outputSamples??r.reported)?formatNumber(r.output):'未报告'),h('td',null,r.failed+'/'+r.cancelled)))))));
   body=h(React.Fragment,null,h(IntelligencePanel,{store,control,onCompacted:()=>run('contextUsage',{sessionId:store.snapshot().sessionId})}),h('details',null,h('summary',null,'用量与缓存明细'),h('p',null,'使用 DSH 原生 Token Meter 与压缩机制。API 用量与上下文估算分开显示；模型未报告的缓存或 token 不记为零。'),h('div',{className:'zw-row-actions'},h('button',{disabled:busy||!state.sessionId,onClick:()=>run('contextUsage',{sessionId:state.sessionId})},'刷新当前会话'),h('button',{disabled:busy||!state.sessionId,onClick:()=>run('refreshMemory',{sessionId:state.sessionId})},'刷新会话记忆')),
    usage?.available?h(React.Fragment,null,h('div',{className:'zs-meter'},h('small',null,usage.model?.model??'当前会话'),h('strong',null,formatNumber(usage.tokens)+' / '+formatNumber(usage.capacity)),h('progress',{max:1,value:Math.min(1,ratio??0)}),h('p',null,ratio===null?'模型未声明上下文容量':(ratio*100).toFixed(1)+'%'+(ratio>.85?' · 建议整理任务并压缩旧历史':'')),h('small',null,usage.basis==='projected'?'与会话面板一致 · API 上下文基线及可见内容增量':usage.basis==='usage'?'最近一次 API 上下文用量':usage.basis==='estimated'?'原生估算；不等于账单用量':'尚未取得可靠占用')),usage.breakdown?h('div',null,...[['系统提示','systemTokens'],['工具定义','toolsTokens'],['消息','messageTokens']].map(([label,key])=>h('div',{key,className:'zs-usage-row'},h('span',null,label+'（估算）'),h('span',null,formatNumber(usage.breakdown[key]))))):null,h('p',null,'压缩完成 '+usage.compactions+' 次'+(usage.compactionFailures?' · 未完成 '+usage.compactionFailures+' 次':'')),usage.lastCompactionError?h('p',{className:'zw-error'},'最近压缩未完成：'+usage.lastCompactionError):null,table(usage.sessionModels,'当前会话历史回复用量')):h('p',null,'先打开或新建一个会话以查看上下文。'),h('p',null,'各模型累计用量见「设置 → Token 用量」。'),h('p',null,'历史回复用量只统计当前会话日志，不补算未记录的请求。')));
  }
  else if(tab==='history')body=h(React.Fragment,null,h('p',null,'将简洁的长期记忆与完整会话日志分开：记忆在会话开始时冻结，压缩后更新；历史只按需检索。需要立即使用刚修改的记忆，可在上下文页刷新会话记忆。'),h('label',{className:'zw-row-actions'},h('input',{type:'checkbox',checked:data?.historyEnabled??false,disabled:busy||!data,onChange:e=>run('configureWorkbench',{historyEnabled:e.target.checked})}),'允许检索当前工作区的其他会话'),h('p',null,'默认关闭。开启后模型可以按需检索当前工作区最多 512 个会话的原始文字（按需分页），结果会进入当前模型；不读取其他工作区，不提取思考过程、工具输出或认证配置。'),h('form',{className:'zw-inline-form',onSubmit:e=>{e.preventDefault();void run('searchHistory',{query,sessionId:state.sessionId});}},h('input',{'aria-label':'跨会话检索词',value:query,onChange:e=>setQuery(e.target.value),required:true,maxLength:300}),h('button',{disabled:busy||!data?.historyEnabled||!state.sessionId},'搜索')),h('div',{className:'zs-history-results'},...(results?.results??[]).map(r=>h('article',{key:r.sessionId+'-'+r.seq},h('small',null,r.sessionId+' · #'+r.seq),h('pre',null,r.text))),results?h('p',null,'本页检查 '+results.scanned+' 个会话，命中 '+results.results.length+' 条。'):null,results?.next?h('button',{disabled:busy,onClick:()=>run('searchHistory',{query,sessionId:state.sessionId,cursor:results.next})},'继续检索更早记录'):null));
  else body=h(WechatPanel,{control,navigation,sessionId:state.sessionId});
  return h('section',{className:'zw-panel zw-workspace'},h('header',null,h('small',null,'WORKSPACE / PREFERENCES'),h('h2',null,WORKBENCH_TABS.find(x=>x[0]===tab)?.[1])),body,h('p',{role:'status'},notice),h('p',{role:'alert',className:'zw-error'},error));
 }

 const QUIET_CSS="\n /* 0.11 — calm canvas, one visible management destination. */\n html[data-ui-stronger]{--zw-paper:#fcfcfc;--zw-panel:#f6f6f7;--zw-line:#e9e9ec;--zw-soft:#f1eff5;--zw-deep:#6d647a;--zw-purple:#b3a6c5}\n html[data-ui-stronger] [data-ds-dark-theme],html[data-ui-stronger][data-ds-dark-theme]{--zw-paper:#151516;--zw-panel:#1a1a1c;--zw-line:#2b2b2e;--zw-soft:#242229;--zw-deep:#c0b7cd}\n .zs-quiet-home{display:flex!important;flex-direction:column;align-items:center;justify-content:center;min-height:240px;width:min(100%,640px);margin:auto;gap:23px;padding:42px 24px;box-sizing:border-box}\n .zs-quiet-home>.zw-mark{color:var(--zw-purple);opacity:.75}.zs-quiet-home h1{font-size:23px;font-weight:400;letter-spacing:1px;margin:0;color:var(--zw-ink)}\n .zs-home-modules{width:min(100%,420px);margin-top:20px;font-size:11px;color:var(--zw-muted)}.zs-home-modules>summary{cursor:pointer;text-align:center;list-style:none;padding:10px}.zs-home-modules>summary::-webkit-details-marker{display:none}.zs-home-modules[open]{margin-top:8px}.zs-home-modules .zs-launchers{display:flex;flex-direction:column;gap:0;margin:10px 0}.zs-home-modules .zs-launchers button{border:0;border-bottom:1px solid var(--zw-line);border-radius:var(--zw-radius);background:transparent;min-height:44px;padding:10px 0;display:flex;align-items:center;justify-content:space-between;font-size:12px}.zs-home-modules .zs-launchers svg{width:14px;height:14px}.zs-home-modules .zs-work-edit{display:block;margin:14px auto 0}\n .zs-quiet-tools{width:min(640px,calc(100vw - 24px));max-height:calc(100dvh - 32px);border:1px solid var(--zw-line);border-radius:var(--zw-radius);padding:0!important;background:var(--zw-paper)}\n .zs-quiet-tools>.zs-surface-header{padding:18px 26px;border-bottom:1px solid var(--zw-line);margin:0;min-height:56px;box-sizing:border-box}.zs-section-select{display:flex;align-items:center;gap:20px;font-size:12px;color:var(--zw-muted)}.zs-section-select select{font-family:inherit;font-size:13px;color:var(--zw-ink);background:transparent;border:0;padding:7px 28px 7px 0;cursor:pointer;max-width:260px}.zs-quiet-tools>.zw-panel{padding:28px 30px 40px;margin:0;max-width:none;overflow-y:auto;min-height:0}.zs-quiet-tools .zw-panel header{padding-bottom:20px;margin-top:0;gap:12px}.zs-quiet-tools .zw-panel header small{display:none}.zs-quiet-tools .zw-panel h2{font-size:17px;letter-spacing:0;font-weight:500;margin:0}.zs-quiet-tools .zw-panel p{font-size:12px;line-height:1.85;margin:12px 0;color:var(--zw-muted)}.zs-quiet-tools .zw-panel h3{font-size:13px;font-weight:500;margin-top:26px}.zs-quiet-tools .zw-setting{padding:18px 0}.zs-quiet-tools .zw-panel button:not([role=switch]){min-height:30px;padding:6px 10px;box-shadow:none;font-size:12px}.zs-quiet-tools :is(input,select,textarea):focus-visible{outline:1px solid var(--zw-purple);outline-offset:2px}\n .zs-workspace-choices{display:flex;flex-direction:column;gap:12px;border:0;padding:0;margin:22px 0}.zs-workspace-choices legend{font-size:12px;margin-bottom:14px}.zs-workspace-choices label{display:flex;gap:9px;align-items:center}.zs-workspace-choices input[type=checkbox]{width:auto}.zs-workspace-choices button{align-self:flex-start}.zs-form-field{display:grid;gap:9px;margin:20px 0}.zs-qr{display:grid;justify-items:center;margin:24px 0}.zs-qr img{max-width:100%;height:auto}.zs-subtle{font-size:11px!important}.zs-quiet-tools .zs-meter{background:transparent;border:0;border-bottom:1px solid var(--zw-line);padding:16px 0 22px}.zs-quiet-tools .zs-meter strong{font-size:25px;font-weight:400}.zs-quiet-tools .zs-module-row{background:none;border:0;border-bottom:1px solid var(--zw-line);padding:20px 0}.zs-quiet-tools .zw-record-editor{border:0;background:var(--zw-panel);padding:18px}.zs-quiet-tools .zw-safety-state{border:0;padding:16px 0;background:transparent}\n .zs-rail-extras .zs-rail-button>span:last-child{display:none}.zs-rail-extras .zs-rail-button{min-height:36px}.zs-portal-brand{opacity:.8}.zw-frame,.zs-session-heading small{display:none!important}.zw-live{display:none}.zw-controls:empty{display:none}.zs-header-label{display:none}.zw-hero:before,.zw-hero:after{display:none}\n html[data-ui-stronger] .LOmM4q_bubble{border:0;background:var(--zw-panel);padding:12px 17px;border-radius:var(--zw-radius);line-height:1.8}html[data-ui-stronger] .WOwLGG_stack{gap:26px}html[data-ui-stronger] .WOwLGG_headline{letter-spacing:0}html[data-ui-stronger] [class*=\"_inputBar\"],html[data-ui-stronger] [class*=\"_composerCard\"]{box-shadow:none}\n @media(max-width:600px){.zs-quiet-tools>.zw-panel{padding:22px 20px 30px}.zs-quiet-tools>.zs-surface-header{padding:14px 20px}.zs-quiet-home h1{font-size:20px}.zs-quiet-home{min-height:200px;padding:30px 16px}.zs-section-select{gap:14px}}\n";
 const FUTURE_CSS=`
html[data-ui-stronger]{--dsw-radius-xl:5px;--dsw-radius-lg:4px}
.zs-quiet-home{position:relative;gap:22px;min-height:270px}
.zs-quiet-home:before,.zs-quiet-home:after{content:'';position:absolute;width:22px;height:22px;border-color:var(--zw-line);border-style:solid;pointer-events:none}
.zs-quiet-home:before{left:10%;top:36px;border-width:1px 0 0 1px}.zs-quiet-home:after{right:10%;bottom:36px;border-width:0 1px 1px 0}
.zs-quiet-home>.zw-mark{color:var(--zw-ink);opacity:.85}.zs-quiet-home h1{font-size:22px;letter-spacing:.08em}
.zs-start-hint{letter-spacing:.035em}.zs-quiet-tools{border-radius:var(--zw-radius)}.zs-quiet-tools>.zs-surface-header{position:relative}
.zs-quiet-tools>.zs-surface-header:before{content:'';position:absolute;left:-3px;top:25px;width:5px;height:5px;background:var(--zw-purple);transform:rotate(45deg)}
.zs-quiet-tools .zw-panel button:not([role=switch]){border-radius:var(--zw-radius)}.zs-context-intro{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-bottom:20px}.zs-context-intro b{font-size:14px;font-weight:500}.zs-context-intro button{flex-shrink:0}
.zs-intelligence details{border-top:1px solid var(--zw-line);padding:18px 0;margin-top:24px}.zs-intelligence summary,.zw-workspace>details>summary{cursor:pointer;font-size:12px;color:var(--zw-ink)}
.zs-intelligence .zs-form-field{grid-template-columns:minmax(110px,1fr) minmax(160px,1.4fr);align-items:center}.zs-intelligence select{width:100%;min-width:0;background:var(--zw-paper);border:1px solid var(--zw-line);border-radius:var(--zw-radius);padding:8px;color:var(--zw-ink);font-family:inherit;font-size:12px}
html[data-ui-stronger][data-ui-stronger-motion] .zs-intelligence details[open]>:not(summary){animation:zw-arrive .18s ease-out both}
@media(max-width:520px){.zs-intelligence .zs-form-field{grid-template-columns:1fr}.zs-context-intro{align-items:flex-start}.zs-quiet-home:before{left:4%}.zs-quiet-home:after{right:4%}}
`;
 const EASE_CSS='.zs-start-hint{font-size:11px;color:var(--zw-muted);margin:-8px 0 0}.zs-start-actions{display:flex;flex-wrap:wrap;gap:8px;margin:24px 0 30px}.zs-getting-started details,.zs-process>details,.zs-process>div>details{border-top:1px solid var(--zw-line);padding:18px 0;font-size:12px}.zs-getting-started summary,.zs-process summary{cursor:pointer;color:var(--zw-ink)}.zs-process ol{list-style:none;padding:0;margin:16px 0}.zs-process ol li{display:flex;justify-content:space-between;gap:12px;padding:10px 0;border-bottom:1px solid var(--zw-line);font-size:12px}.zs-process small{color:var(--zw-muted);font-size:10px;overflow-wrap:anywhere}.zs-process pre{white-space:pre-wrap;font-family:inherit;font-size:12px;line-height:1.8;overflow-wrap:anywhere}.zs-process article{padding:16px 0;border-bottom:1px solid var(--zw-line)}.zs-process b{font-size:12px;font-weight:500}.zs-process ul{padding-left:18px;font-size:12px;line-height:1.9}.zs-process-trigger{font-family:inherit;font-size:11px;border:0;color:var(--zw-muted);padding:5px 7px;min-height:26px}';
 const POLISH_CSS=`
 html[data-ui-stronger],html[data-ui-stronger] body{--dsw-radius-xl:16px;--dsw-radius-lg:12px;--dsw-radius-md:9px;--dsw-radius-sm:7px;--dsw-radius-panel:16px}
 .zs-quiet-tools{border-radius:var(--zw-radius);overflow:hidden;box-shadow:0 14px 60px #0000000d}
 .zs-quiet-tools>.zs-surface-header{padding:14px 22px;gap:16px;flex-shrink:0}
 .zs-section-select{min-width:0;flex:1;gap:16px}.zs-section-select select{font-family:inherit;min-width:0;max-width:100%;font-size:13px}
 .zs-quiet-tools .zw-panel button:not([role=switch]),.zs-quiet-tools :is(select,input:not([type=range]):not([type=checkbox]),textarea){border-radius:var(--zw-radius)}
 .zs-quiet-tools :is(select,input:not([type=range]):not([type=checkbox]),textarea){box-sizing:border-box;max-width:100%}
 .zs-icon-button{display:inline-flex;align-items:center;justify-content:center;flex:none;width:30px;height:30px;padding:6px!important;border-radius:var(--zw-radius)}
 .zs-icon-button svg{width:16px;height:16px;display:block}
 .zs-model-toolbar{display:flex;flex-direction:column;align-items:flex-start;gap:6px;margin-bottom:24px}.zs-model-toolbar p{margin:0!important}
 .zs-model-state{grid-template-columns:minmax(90px,.7fr) minmax(0,2fr);gap:12px 16px;padding:16px;background:var(--zw-panel);border-radius:var(--zw-radius);line-height:1.7}
 .zs-model-refresh{display:flex;align-items:center;justify-content:space-between;gap:16px;margin:26px 0 8px;font-size:11px;color:var(--zw-muted)}
 .zs-models-panel>h3{display:none}.zs-models-panel>.zs-subtle{margin:8px 0 18px}.zs-model-provider summary{padding:5px 0;overflow-wrap:anywhere;line-height:1.7}
 .zs-model-access-row>span{min-width:0}
 html[data-ui-stronger] .LOmM4q_bubble{border-radius:var(--zw-radius)}
 html[data-ui-stronger] .GRgSLq_card{border-radius:var(--zw-radius)}
 html[data-ui-stronger] .an3WzG_root[data-phase=hero] .an3WzG_composerSeat{min-height:min(620px,calc(100dvh - 96px))}
 @media(max-width:520px){.zs-quiet-tools{width:calc(100vw - 16px);max-height:calc(100dvh - 16px)}.zs-quiet-tools>.zs-surface-header{padding:12px 16px}.zs-quiet-tools>.zw-panel{padding:18px 18px 26px}.zs-model-state{grid-template-columns:1fr;gap:5px;padding:14px}.zs-model-state dd{margin-bottom:9px}}
 `;
 const STUDIO_CSS=`
 html[data-ui-stronger]{--zw-paper:#fcfcfd;--zw-panel:#f4f4f6;--zw-line:#e7e7ec;--zw-muted:#76727e;--zw-soft:#f0edf5;--zw-purple:#b3a2c9}
 html[data-ui-stronger] [data-ds-dark-theme],html[data-ui-stronger][data-ds-dark-theme]{--zw-paper:#151517;--zw-panel:#1c1c20;--zw-line:#2e2e34;--zw-muted:#a09ba9;--zw-soft:#27242e;--zw-purple:#c1aed5}
 .zs-surface-backdrop{background:#15151a24;backdrop-filter:none;padding:12px;box-sizing:border-box;gap:12px}
 .zs-quiet-tools{width:min(600px,100%);max-height:100%;border-radius:var(--zw-radius);background:var(--zw-paper);box-shadow:0 18px 72px #00000012;border:1px solid var(--zw-line)}
 .zs-quiet-tools>.zs-surface-header{min-height:76px;padding:20px 26px;border-bottom:1px solid var(--zw-line)}
 .zs-quiet-tools>.zs-surface-header:before{display:none}.zs-section-select>span{display:none}.zs-section-select select{font-family:inherit;font-size:17px;font-weight:550;letter-spacing:-.02em;padding:7px 28px 7px 0}
 .zs-quiet-tools>.zw-panel{padding:26px 28px 30px}.zs-quiet-tools .zw-panel p:empty{display:none}.zs-quiet-tools .zw-panel p{line-height:1.8}
 .zs-caption{display:block;font-size:11px;line-height:1.5;letter-spacing:.02em;color:var(--zw-muted)}
 .zs-model-toolbar{flex-direction:row;align-items:center;justify-content:space-between;gap:20px;margin:0 0 26px}.zs-model-toolbar p{font-size:11px!important;margin:5px 0 0!important}
 .zs-quiet-tools .zw-panel button.zs-primary-action{border:1px solid var(--zw-line);background:var(--zw-panel);border-radius:var(--zw-radius);padding:8px 12px;min-height:36px;white-space:nowrap;flex-shrink:0;gap:12px;font-size:12px}.zs-primary-action svg{width:13px;height:13px}
 .zs-quiet-tools>.zs-surface-header>.zs-icon-button{width:32px;height:32px}
 .zs-current-model{position:relative;display:grid;gap:8px;border:1px solid var(--zw-line);border-radius:var(--zw-radius);padding:22px 24px;background:var(--zw-paper);overflow-wrap:anywhere}
 .zs-current-model:before{content:'';position:absolute;left:0;top:24px;width:2px;height:24px;background:var(--zw-purple)}
 .zs-current-model strong{font-size:21px;font-weight:500;line-height:1.35;letter-spacing:-.025em;color:var(--zw-ink)}.zs-provider-caption{font:11px/1.5 ui-monospace,monospace;color:var(--zw-muted)}
 .zs-model-details{margin:16px 0 28px}.zs-model-details summary{cursor:pointer;font-size:11px;color:var(--zw-muted)}.zs-model-details .zs-model-state{background:none;border:0;padding:12px 0;margin:0;border-radius:var(--zw-radius);font-size:11px;grid-template-columns:110px minmax(0,1fr)}
 .zs-model-refresh{margin:26px 0 2px;min-height:32px;font-size:11px}.zs-quiet-tools .zw-panel .zs-model-refresh button{border:0;background:transparent;padding:5px 0;min-height:28px;color:var(--zw-muted)}
 .zs-model-provider{padding:0;border-top:1px solid var(--zw-line)}.zs-model-provider>summary{list-style:none;display:flex;align-items:center;gap:12px;min-height:62px;padding:12px 0;box-sizing:border-box;color:var(--zw-ink);font-size:13px;cursor:pointer}.zs-model-provider>summary::-webkit-details-marker{display:none}.zs-model-provider>summary>span{min-width:0;overflow-wrap:anywhere}.zs-model-provider>summary>small{margin-left:auto;color:var(--zw-muted);white-space:nowrap;font-size:11px;font-weight:400}
 .zs-model-provider>summary:after{content:'';width:5px;height:5px;border:solid var(--zw-muted);border-width:1px 1px 0 0;transform:rotate(45deg);margin:0 3px 0 8px;flex-shrink:0}.zs-model-provider[open]>summary:after{transform:rotate(135deg)}
 .zs-provider-access,.zs-model-access-row{display:flex;align-items:center;justify-content:space-between;gap:20px;min-height:46px;padding:8px 0;box-sizing:border-box;font-size:12px}.zs-provider-access{padding:2px 0 14px;color:var(--zw-muted);border-bottom:1px solid var(--zw-line);margin-bottom:4px}.zs-provider-access>div{display:grid;gap:3px;min-width:0}.zs-provider-access small{font:10px/1.5 ui-monospace,monospace;overflow-wrap:anywhere}.zs-model-provider[open]{padding-bottom:14px}
 .zs-quiet-tools .zw-panel .zs-footnote{font-size:10px;margin:22px 0 0;color:var(--zw-muted)}.zs-inline-notice{font-size:11px!important;padding:10px 12px;background:var(--zw-panel);border-radius:var(--zw-radius);overflow-wrap:anywhere}
 .zs-quiet-home{min-height:240px;gap:18px;padding:40px 24px 24px;width:min(100%,600px)}.zs-quiet-home:before,.zs-quiet-home:after{display:none}.zs-quiet-home>.zw-mark{width:32px;height:32px;margin-bottom:8px;color:var(--zw-ink)}.zs-quiet-home h1{font-size:26px;font-weight:450;letter-spacing:-.035em;line-height:1.4}.zs-start-hint{margin:0;font-size:12px;letter-spacing:0;color:var(--zw-muted)}
 .zs-home-modules{margin-top:12px}.zs-home-modules>summary{font-size:11px;display:flex;align-items:center;justify-content:center;gap:9px}.zs-home-modules>summary:before{content:'';width:3px;height:3px;background:var(--zw-purple);transform:rotate(45deg)}
 html[data-ui-stronger] .an3WzG_root[data-phase=hero] .an3WzG_composerSeat{min-height:min(530px,calc(100dvh - 92px))}html[data-ui-stronger] .an3WzG_composerHero{width:min(760px,100%);gap:24px}html[data-ui-stronger] .GRgSLq_card{border-radius:var(--zw-radius);border-color:var(--zw-line);padding:14px 12px 6px;box-shadow:0 4px 24px #00000003}html[data-ui-stronger] .GRgSLq_card:focus-within{border-color:color-mix(in srgb,var(--zw-purple) 70%,var(--zw-line));box-shadow:0 0 0 3px color-mix(in srgb,var(--zw-purple) 8%,transparent)}
 .zs-palette{border-radius:var(--zw-radius)}.zs-command-results button{border-radius:var(--zw-radius)}.zs-palette footer{font-size:10px;letter-spacing:0}
 html[data-ui-stronger-motion] .zs-quiet-tools>.zw-panel{animation:none}html[data-ui-stronger-motion] .zs-model-provider>summary:after{transition:transform 160ms ease}
 @keyframes zs-studio-enter{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
 @media(max-width:560px){.zs-surface-backdrop{padding:8px}.zs-quiet-tools{width:100%;max-height:100%;border-radius:var(--zw-radius)}.zs-quiet-tools>.zs-surface-header{min-height:66px;padding:16px 20px}.zs-quiet-tools>.zw-panel{padding:22px 20px 26px}.zs-model-toolbar{gap:12px}.zs-model-toolbar p{max-width:180px}.zs-current-model{padding:20px}.zs-current-model strong{font-size:19px}.zs-model-details .zs-model-state{grid-template-columns:1fr}.zs-quiet-home{min-height:220px;padding:30px 20px 20px}.zs-quiet-home h1{font-size:23px}}
 @media(max-width:600px){html[data-ui-stronger] .an3WzG_headerCorner{margin-inline-end:16px}}
 @media(prefers-reduced-motion:reduce){html[data-ui-stronger-motion] .zs-quiet-tools>.zw-panel{animation:none}html[data-ui-stronger-motion] .zs-model-provider>summary:after{transition:none}}
 `;
 const MODEL_ACCESS_CSS='.zw-panel button[role=switch]{display:inline-flex;align-items:center;font-size:0!important}.zw-panel button[role=switch]:before{display:block;flex:none;transition:none}html[data-ui-stronger-motion] .zw-panel button[role=switch]:before{transition:transform 180ms,background-color 160ms}.zs-native-models{border:1px solid var(--zw-line);background:var(--zw-paper);color:var(--zw-ink);font-family:inherit;font-size:11px;border-radius:var(--zw-radius);padding:7px 5px;cursor:pointer}.zs-model-state{display:grid;grid-template-columns:100px minmax(0,1fr);gap:12px;margin:24px 0;font-size:12px}.zs-model-provider{border-top:1px solid var(--zw-line);padding:16px 0;font-size:12px}.zs-model-provider summary{cursor:pointer}.zs-model-access-row{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:10px 0}.zs-model-access-row span{overflow-wrap:anywhere}.zs-model-state dt{color:var(--zw-muted)}.zs-model-state dd{margin:0;overflow-wrap:anywhere}';
 const SHELL_CSS=`/* One navigation column. Host owns panels, settings, workspaces and window chrome. */
html[data-ui-stronger] .wtg9ga_root{display:flex;flex-direction:column;box-sizing:border-box;position:relative;background:var(--zw-paper);color:var(--zw-ink);--dsh-sidebar-inline-padding:16px;padding:0 16px 12px;gap:0}
html[data-ui-stronger] .wtg9ga_root:before{content:none}
html[data-ui-stronger] .wtg9ga_logoRow{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:68px;height:68px;flex-shrink:0;position:relative;overflow:visible;margin:0;padding:12px 0;box-sizing:border-box}
html[data-ui-stronger] .wtg9ga_logoRow .wtg9ga_brand{display:none}
.zs-shell-identity{order:-1;display:flex;align-items:center;gap:10px;min-width:0;pointer-events:none;flex:1;color:var(--zw-ink)}
.zs-shell-identity>.zw-mark{flex-shrink:0;width:27px;height:27px}.zs-shell-identity>span{display:grid;gap:3px;min-width:0}.zs-shell-identity small{font:8px/1.2 ui-monospace,Consolas,monospace;letter-spacing:2.5px;color:var(--zw-muted)}.zs-shell-identity strong{font:550 13px/1.15 ui-sans-serif,system-ui,sans-serif;letter-spacing:1.1px}
html[data-ui-stronger] .wtg9ga_newSession{box-sizing:border-box;min-height:38px;height:38px;margin:0 0 16px;padding:8px 12px;border:1px solid var(--zw-ink);border-radius:var(--zw-radius);background:var(--zw-ink);color:var(--zw-paper);font-size:12px;font-weight:500;flex-shrink:0}
html[data-ui-stronger] .wtg9ga_newSessionContent{gap:8px}html[data-ui-stronger] .wtg9ga_newSessionLabel{white-space:nowrap}html[data-ui-stronger] .wtg9ga_newSessionShortcut{display:none}
html[data-ui-stronger] .wtg9ga_panelList{display:flex;flex-direction:column;gap:2px;flex:none;min-height:0;max-height:29vh;margin:0 0 16px;padding:0 0 12px;overflow:auto;border-bottom:1px solid var(--zw-line);scrollbar-width:thin}
html[data-ui-stronger] .wtg9ga_panelRow{display:flex;flex-direction:row;align-items:center;justify-content:flex-start;gap:10px;min-height:36px;flex-shrink:0;padding:8px 11px;margin:0;border:0;border-radius:var(--zw-radius);background:transparent;color:var(--zw-muted);font-family:inherit;font-size:12px;line-height:20px;box-sizing:border-box;position:relative;min-width:0;max-width:100%}
html[data-ui-stronger] .wtg9ga_panelRow:hover{color:var(--zw-ink);background:var(--zw-panel)}html[data-ui-stronger] .wtg9ga_panelActive{color:var(--zw-ink);background:var(--zw-soft)}html[data-ui-stronger] .wtg9ga_panelActive:before{content:'';width:2px;height:14px;background:var(--zw-purple);position:absolute;left:0;border-radius:var(--zw-radius)}
html[data-ui-stronger] .wtg9ga_panelGlyph{display:inline-flex;align-items:center;justify-content:center;flex:none;width:18px;height:18px}html[data-ui-stronger] .wtg9ga_panelGlyph svg{width:17px;height:17px;display:block}html[data-ui-stronger] .wtg9ga_panelTitle{display:block;min-width:0;max-width:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:20px}
html[data-ui-stronger] .wtg9ga_regionArea{flex:1;min-height:0;min-width:0;margin:0;padding:0;overflow:hidden}
html[data-ui-stronger] .wtg9ga_footArea{display:flex;flex-direction:column;align-items:stretch;flex:none;gap:10px;margin:0;padding:12px 0 0;border-top:1px solid var(--zw-line);min-width:0}
html[data-ui-stronger] .wtg9ga_footerActions{display:flex;flex-direction:row;align-items:center;justify-content:flex-start;flex-wrap:wrap;gap:4px;min-width:0}
html[data-ui-stronger] .wtg9ga_footerActions:empty{display:none}html[data-ui-stronger] .wtg9ga_footerActions button{display:inline-flex;align-items:center;justify-content:center;gap:6px;flex-shrink:0;box-sizing:border-box;min-height:32px;min-width:32px;max-width:100%;width:auto;height:auto;padding:6px 8px;border-radius:var(--zw-radius);font-size:11px;line-height:18px;white-space:nowrap;color:var(--zw-muted)}
html[data-ui-stronger] .wtg9ga_footerActions button svg{display:block;width:16px;height:16px;flex-shrink:0}html[data-ui-stronger] .wtg9ga_footerActions button:hover{color:var(--zw-ink);background:var(--zw-panel)}
.zs-extension-entry{border:0;background:transparent;color:var(--zw-muted);cursor:pointer;font-family:inherit}.zs-extension-entry svg{width:16px;height:16px;flex-shrink:0}
html[data-ui-stronger] .wtg9ga_settingsArea{display:flex;justify-content:flex-start;min-width:0}html[data-ui-stronger] .wtg9ga_settingsArea ._5Qcc8a_trigger{width:100%;max-width:100%;height:36px;min-height:36px;display:flex;flex-direction:row;align-items:center;justify-content:flex-start;gap:9px;padding:4px 8px;font-size:11px;box-sizing:border-box;border-radius:var(--zw-radius)}
html[data-ui-stronger] .wtg9ga_settingsArea ._5Qcc8a_label{min-width:0;max-width:none;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;line-height:20px}html[data-ui-stronger] .wtg9ga_settingsArea ._5Qcc8a_trigger>svg{width:17px;height:17px;flex-shrink:0}
html[data-ui-stronger] .wtg9ga_root.wtg9ga_collapsed{padding:12px 8px 8px;align-items:stretch}.wtg9ga_collapsed .zs-shell-identity{display:none}html[data-ui-stronger] .wtg9ga_collapsed .wtg9ga_logoRow{height:36px;min-height:36px;margin:0 0 12px;padding:0;justify-content:center}
html[data-ui-stronger] .wtg9ga_collapsed .wtg9ga_newSession{width:36px;height:36px;min-height:36px;padding:0;margin:0 0 14px;align-self:center;background:transparent;border-color:transparent;color:var(--zw-ink)}
html[data-ui-stronger] .wtg9ga_collapsed .wtg9ga_panelList{max-height:none;margin:0;padding:0;border:0;gap:5px;flex:1;min-height:0}html[data-ui-stronger] .wtg9ga_collapsed .wtg9ga_panelRow{width:36px;min-height:36px;justify-content:center;align-self:center;padding:8px;gap:0}
html[data-ui-stronger] .wtg9ga_collapsed .wtg9ga_regionArea{flex:none}html[data-ui-stronger] .wtg9ga_collapsed .wtg9ga_footArea{margin-top:auto;padding-top:10px;gap:7px;align-items:center}html[data-ui-stronger] .wtg9ga_collapsed .wtg9ga_footerActions{flex-direction:column;flex-wrap:nowrap;gap:5px}html[data-ui-stronger] .wtg9ga_collapsed .wtg9ga_footerActions button{width:36px;height:36px;padding:8px;gap:0}html[data-ui-stronger] .wtg9ga_collapsed .wtg9ga_settingsArea ._5Qcc8a_trigger{width:36px;height:36px;padding:6px;justify-content:center}

html[data-ui-stronger][data-ui-stronger-native-shortcuts] .wtg9ga_panelList [aria-haspopup="menu"]{display:none}
html[data-ui-stronger] .wtg9ga_panelRow:is([aria-label="插件"],[aria-label="Plugins"]) .wtg9ga_panelGlyph>svg{display:none}
html[data-ui-stronger] .wtg9ga_panelRow:is([aria-label="插件"],[aria-label="Plugins"]) .wtg9ga_panelGlyph:before{content:'';display:block;width:17px;height:17px;background:currentColor;mask:center/contain no-repeat url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z' fill='none' stroke='black' stroke-width='1.4' stroke-linejoin='round'/%3E%3C/svg%3E")}

/* Respect native Windows menu/control clearance; do not reserve a second content rail. */
html[data-ui-stronger][data-windows-titlebar] .wtg9ga_root:not(.wtg9ga_collapsed) .wtg9ga_logoRow{height:58px;min-height:58px;padding:12px 0}
html[data-ui-stronger][data-windows-titlebar] .wtg9ga_root.wtg9ga_collapsed{padding:0}
html[data-ui-stronger][data-windows-titlebar] .wtg9ga_collapsed .wtg9ga_logoRow{height:0;min-height:0;margin:0;padding:0}
html[data-ui-stronger][data-windows-titlebar] .wtg9ga_collapsed .wtg9ga_newSession{width:28px;height:28px;min-height:28px;margin:0;padding:0}
/* Quiet technical hierarchy: typographic rhythm and purposeful geometry, no decorative data. */
.zs-quiet-home{min-height:210px;gap:18px;padding:32px 24px 18px}.zs-quiet-home>.zw-mark{width:35px;height:35px;margin:0 0 6px}.zs-quiet-home h1{font-size:27px;font-weight:450;letter-spacing:-.025em;line-height:1.4}.zs-start-hint{font-size:11px;line-height:1.8}.zs-home-modules:empty{display:none}
.zs-quiet-tools{border-radius:var(--zw-radius)}.zs-quiet-tools>.zs-surface-header{min-height:65px;padding:17px 26px;position:relative}.zs-quiet-tools>.zs-surface-header:after{content:'';position:absolute;left:26px;bottom:-1px;width:22px;height:1px;background:var(--zw-purple)}.zs-section-select select{font-size:15px;font-weight:500;letter-spacing:0}.zs-quiet-tools .zs-page-transition>.zw-panel{padding:26px}.zs-current-model{border-radius:var(--zw-radius)}.zs-current-model strong{font-size:19px}.zs-quiet-tools :is(input,textarea,select){border-radius:var(--zw-radius)}.zs-quiet-tools details>summary{line-height:1.8}
html[data-ui-stronger] .GRgSLq_card{border-radius:var(--zw-radius);box-shadow:none;border-color:var(--zw-line)}html[data-ui-stronger] .GRgSLq_row{border-top:0;padding-top:4px}html[data-ui-stronger] .GRgSLq_primary{border-radius:var(--zw-radius)}html[data-ui-stronger] .LOmM4q_bubble{border-radius:var(--zw-radius)}
html[data-ui-stronger-motion] .wtg9ga_panelRow,html[data-ui-stronger-motion] .zs-extension-entry{transition:background-color 150ms ease,color 150ms ease}
@media(max-width:560px){.zs-quiet-tools{border-radius:var(--zw-radius)}.zs-quiet-tools>.zs-surface-header{padding:16px 20px}.zs-quiet-tools>.zs-surface-header:after{left:20px}.zs-quiet-tools .zs-page-transition>.zw-panel{padding:22px 20px}.zs-quiet-home h1{font-size:23px}}
@media(prefers-reduced-motion:reduce){html[data-ui-stronger] .wtg9ga_panelRow,html[data-ui-stronger] .zs-extension-entry{transition:none}}
`;
 const ANGULAR_CSS="/* Final surface language: hard edges, solid fills, restrained elevation.\n   Keep avatar circles, loading orbits, icon masks and user media intact. */\nhtml[data-ui-stronger]{--dsw-radius-xs:0px;--dsw-radius-sm:0px;--dsw-radius-md:0px;--dsw-radius-lg:0px;--dsw-radius-xl:0px;--zs-shadow-surface:0 1px 2px #00000008,0 4px 12px #00000005;--zs-shadow-overlay:0 2px 4px #0000000a,0 8px 24px #0000000d}\nhtml[data-ui-stronger]:is([data-ds-dark-theme],:has([data-ds-dark-theme])){--zs-shadow-surface:0 1px 3px #00000026,0 4px 12px #00000014;--zs-shadow-overlay:0 2px 5px #00000033,0 8px 24px #00000026}\nhtml[data-ui-stronger] :where(.zw-panel,.zs-tools,.zs-palette,.zs-welcome,.zw-controls,.zs-process,.zs-home-modules) :is(button,input:not([type=radio]),textarea,select,[role=tab],[role=menuitem]:where(.zs-tools,.zs-tools *,.zs-palette,.zs-palette *,.zw-panel,.zw-panel *),[role=option]:where(.zs-tools,.zs-tools *,.zs-palette,.zs-palette *,.zw-panel,.zw-panel *),[role=progressbar],[class*=\"_navCell\"],[class*=\"_sessionRow\"],[class*=\"_projectRow\"],[class*=\"_sectionHeader\"],[class*=\"_panelRow\"],[class*=\"_card\"],[class*=\"_Card\"],[class*=\"_bubble\"],[class*=\"_search\"],[class*=\"_Search\"],.zs-quiet-tools,.zs-palette,.zs-current-model,.zs-model-state,.zs-inline-notice,.zs-module-row,.zs-meter,.zw-record-editor,.zw-safety-state,.zw-connect,.zs-quiet-home){border-radius:var(--zw-radius)}\nhtml[data-ui-stronger] :is(.wtg9ga_panelActive,.zw-panel button[role=switch]):before{border-radius:var(--zw-radius)}\nhtml[data-ui-stronger] :where(.zw-panel,.zs-tools,.zs-palette,.zs-welcome,.zw-controls,.zs-process,.zs-home-modules) :is([role=progressbar],.zs-meter,.zw-meter) *,html[data-ui-stronger] :where(.zw-panel,.zs-tools,.zs-palette,.zs-welcome,.zw-controls,.zs-process,.zs-home-modules) input[type=range]{border-radius:var(--zw-radius)}\nhtml[data-ui-stronger] :where(.zw-panel,.zs-tools,.zs-palette,.zs-welcome,.zw-controls,.zs-process,.zs-home-modules) input[type=range]::-webkit-slider-runnable-track{border-radius:var(--zw-radius)}\nhtml[data-ui-stronger] :where(.zw-panel,.zs-tools,.zs-palette,.zs-welcome,.zw-controls,.zs-process,.zs-home-modules) input[type=range]::-moz-range-track{border-radius:var(--zw-radius)}\n/* Search surfaces never carry a decorative gradient; keep native icons. */\nhtml[data-ui-stronger] :where(.zw-panel,.zs-tools,.zs-palette,.zs-welcome,.zw-controls,.zs-process,.zs-home-modules) :is([class*=\"_searchBox\"],[class*=\"_searchBar\"],[class*=\"_searchInput\"],[class*=\"_SearchBox\"],[class*=\"_SearchBar\"],[role=search],.zs-palette header,.zs-palette input,input[type=search]){background-image:none!important;background-color:var(--zw-paper)!important}\nhtml[data-ui-stronger] :where(.zw-panel,.zs-tools,.zs-palette,.zs-welcome,.zw-controls,.zs-process,.zs-home-modules) :is([class*=\"_searchBox\"],[class*=\"_searchBar\"],[class*=\"_SearchBox\"],[class*=\"_SearchBar\"],[role=search],.zs-palette header):before,\nhtml[data-ui-stronger] :where(.zw-panel,.zs-tools,.zs-palette,.zs-welcome,.zw-controls,.zs-process,.zs-home-modules) :is([class*=\"_searchBox\"],[class*=\"_searchBar\"],[class*=\"_SearchBox\"],[class*=\"_SearchBar\"],[role=search],.zs-palette header):after{background-image:none!important;box-shadow:none!important}\nhtml[data-ui-stronger] :is(.GRgSLq_card,.zs-current-model,.zs-model-state,.zw-record-editor,[class*=\"_searchBox\"],[class*=\"_searchBar\"],[class*=\"_SearchBox\"],[class*=\"_SearchBar\"],[role=search]){box-shadow:var(--zs-shadow-surface)!important}\nhtml[data-ui-stronger] :is(.zs-quiet-tools,.zs-palette,.AnXs9G_panel,[role=dialog]:where(.zs-tools,.zs-tools *,.zs-palette,.zs-palette *,.zw-panel,.zw-panel *),[role=menu]:where(.zs-tools,.zs-tools *,.zs-palette,.zs-palette *,.zw-panel,.zw-panel *),[role=listbox]:where(.zs-tools,.zs-tools *,.zs-palette,.zs-palette *,.zw-panel,.zw-panel *)){border-radius:var(--zw-radius);box-shadow:var(--zs-shadow-overlay)!important}\n/* A focus edge carries state without adding a second decorative halo. */\nhtml[data-ui-stronger] .GRgSLq_card:focus-within{border-color:var(--zw-purple);box-shadow:var(--zs-shadow-surface)!important}\n\nhtml[data-ui-stronger] .GAkraW_search{background:var(--zw-paper)!important;box-shadow:var(--zs-shadow-surface)!important}\nhtml[data-ui-stronger] .GAkraW_fade{display:none}\n";
 const SURFACE_CSS=`
 :where(.zs-tools,.zw-panel,.zs-thinking){box-sizing:border-box;color:var(--zw-ink)}
 :where(.zs-tools,.zw-panel,.zs-thinking) :where(button,input,select,textarea){box-sizing:border-box;font-family:inherit}
 :where(.zs-tools,.zw-panel,.zs-thinking) :where(button:not([role=switch]):not(.zs-icon-button)){display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:34px;line-height:20px;text-align:center;vertical-align:middle;letter-spacing:normal}
 :where(.zw-panel,.zs-thinking) :where(p,li,pre){text-align:start;overflow-wrap:anywhere}
 :where(.zw-panel,.zs-thinking) :where(label,small){letter-spacing:normal}
 .zs-page-transition>:is(.zw-panel,.zs-thinking){width:100%;max-width:none;margin:0;padding:22px 24px 30px}
 .zs-page-transition>:is(.zw-panel,.zs-thinking)>header{display:none}
 .zs-page-transition>:is(.zw-panel,.zs-thinking)>p:first-child{margin-top:0}
 .zs-tools>.zs-surface-header{box-sizing:border-box;flex:none;min-height:62px;padding:14px 24px;align-items:center;gap:16px}
 .zs-tools .zs-section-select{display:block;flex:1;min-width:0;margin:0}
 .zs-tools .zs-section-select>span{display:none}
 html[data-ui-stronger] .zs-tools .zs-section-select select{box-sizing:border-box;width:100%;max-width:none;min-height:38px;padding:8px 32px 8px 12px;border:1px solid var(--zw-line);background:transparent;color:var(--zw-ink);font-family:inherit;font-size:12px;line-height:20px;letter-spacing:normal}
 .zs-tools .zs-icon-button{display:inline-flex;align-items:center;justify-content:center;flex:none;width:28px;height:28px;padding:6px;line-height:1}
 .zs-tools .zs-icon-button svg{display:block;width:16px;height:16px;flex:none}
 .zs-file-picker{position:relative;display:flex;flex-wrap:wrap;align-items:center;gap:14px 18px;width:100%;box-sizing:border-box;padding:18px;border:1px dashed var(--zw-line);border-radius:6px;background:var(--zw-panel);margin:18px 0}
 .zs-file-picker .zs-file-copy{flex:1 1 220px;min-width:0}
 .zs-file-picker .zs-file-copy strong{display:block;font-family:inherit;font-size:12px;font-weight:500;line-height:20px;letter-spacing:normal}
 .zs-file-picker .zs-file-copy small{display:block;margin-top:3px;font-size:11px;line-height:18px;letter-spacing:normal;color:var(--zw-muted)}
 .zs-file-picker>input[type=file]{position:absolute!important;width:1px!important;height:1px!important;min-height:0!important;padding:0!important;margin:0!important;border:0!important;opacity:0;clip-path:inset(50%);overflow:hidden}
 .zs-file-picker .zs-file-trigger{display:inline-flex;align-items:center;justify-content:center;gap:7px;flex:none;box-sizing:border-box;min-height:34px;margin:0;padding:6px 12px;border:1px solid var(--zw-line);border-radius:6px;background:var(--zw-paper);color:var(--zw-ink);font-size:12px;line-height:20px;letter-spacing:normal;cursor:pointer;white-space:nowrap}
 .zs-file-picker:has(>input:focus-visible) .zs-file-trigger{outline:2px solid var(--zw-purple);outline-offset:3px}
 .zs-file-picker:has(>input:disabled) .zs-file-trigger{opacity:.5;cursor:default}
 .zs-file-picker .zs-file-trigger svg{display:block;flex:none;width:14px;height:14px}
 .zs-background-settings{margin:20px 0;padding:0;border:0;min-width:0}
 .zs-background-current{display:flex;align-items:baseline;justify-content:space-between;gap:12px;padding-bottom:14px;border-bottom:1px solid var(--zw-line);font-size:12px}
 .zs-background-current strong{font-weight:400;overflow-wrap:anywhere;text-align:end;min-width:0}
 .zs-background-empty{padding:8px 0 18px;border-bottom:1px solid var(--zw-line);color:var(--zw-muted)}
 .zs-background-settings .zs-range-field{display:grid;gap:10px;margin:20px 0}
 .zs-range-field>span{display:flex;align-items:baseline;justify-content:space-between;gap:12px;font-size:12px;line-height:20px}
 .zs-range-field output{font:11px/20px ui-monospace,monospace;color:var(--zw-muted);font-variant-numeric:tabular-nums}
 html[data-ui-stronger] .zs-background-settings input[type=range]{width:100%;height:20px;min-height:0;padding:0;margin:0;border:0;accent-color:var(--zw-purple)}
 html[data-ui-stronger] .zs-background-settings input[type=range]{appearance:none;background:transparent;cursor:pointer}
 html[data-ui-stronger] .zs-background-settings input[type=range]::-webkit-slider-runnable-track{height:3px;border-radius:2px;background:var(--zw-line)}
 html[data-ui-stronger] .zs-background-settings input[type=range]::-webkit-slider-thumb{appearance:none;width:12px;height:12px;margin-top:-4.5px;border:1px solid var(--zw-paper);border-radius:50%;background:var(--zw-purple);box-shadow:0 0 0 1px var(--zw-purple)}
 html[data-ui-stronger] .zs-background-settings input[type=range]::-moz-range-track{height:3px;border:0;border-radius:2px;background:var(--zw-line)}
 html[data-ui-stronger] .zs-background-settings input[type=range]::-moz-range-thumb{width:10px;height:10px;border:1px solid var(--zw-paper);border-radius:50%;background:var(--zw-purple)}
 .zs-background-notes{border-top:1px solid var(--zw-line);padding-top:14px;margin-top:24px;font-size:12px}
 .zs-background-notes summary{cursor:pointer;color:var(--zw-muted)}
 .zs-team-access{display:flex;align-items:center;justify-content:center;gap:4px;flex-wrap:wrap;min-width:0;--zw-ink:#242426;--zw-muted:#74747c;--zw-line:#dedee2;--zw-purple:#a99abe}
 [data-ds-dark-theme] .zs-team-access{--zw-ink:#e6e6e9;--zw-muted:#aaaab0;--zw-line:#45434b;--zw-purple:#b7a7cd}
 .zs-team-switch{display:inline-flex;align-items:center;gap:7px;min-height:28px;padding:3px 7px;border:1px solid transparent;border-radius:5px;background:transparent;color:var(--zw-ink);font-family:inherit;font-size:12px;line-height:20px;white-space:nowrap;cursor:pointer}
 .zs-team-switch:hover:not(:disabled){border-color:var(--zw-line)}.zs-team-switch:disabled{opacity:.5;cursor:default}
 .zs-team-switch:focus-visible{outline:2px solid var(--zw-purple);outline-offset:2px}
 .zs-switch-track{display:inline-flex;align-items:center;width:25px;height:15px;padding:2px;box-sizing:border-box;border:1px solid var(--zw-line);border-radius:4px;flex:none}
 .zs-switch-track i{display:block;width:7px;height:7px;border-radius:2px;background:var(--zw-muted);transition:transform .14s ease,background-color .14s ease}
 .zs-team-switch[aria-checked=true] .zs-switch-track{border-color:var(--zw-purple)}.zs-team-switch[aria-checked=true] i{transform:translateX(10px);background:var(--zw-purple)}
 .zs-team-access .zs-team-entry{min-height:28px;font-size:12px;line-height:20px;padding:3px 7px;cursor:pointer}
 .zs-team-count{display:inline-flex;align-items:center;gap:4px;font-size:11px;color:var(--zw-muted);white-space:nowrap}.zs-team-count button{box-sizing:border-box;width:44px;min-height:28px;padding:3px 5px;border:1px solid var(--zw-line);border-radius:5px;background:transparent;color:var(--zw-ink);font:inherit;cursor:pointer}.zs-team-count button:focus-visible{outline:2px solid var(--zw-purple);outline-offset:2px}.zs-team-count button:disabled{opacity:.5;cursor:default}
 .zs-team-access-error{flex-basis:100%;max-width:300px;color:#b15a6e;font-size:11px;line-height:18px;overflow-wrap:anywhere}
 html[data-ui-stronger] .wtg9ga_newSession{display:grid;grid-template-columns:12px minmax(0,1fr) 12px;align-items:center;justify-content:normal;gap:8px;padding:0 12px;line-height:20px;text-align:center}
 html[data-ui-stronger] .wtg9ga_newSession:before,html[data-ui-stronger] .wtg9ga_newSession:after{position:static;display:block;transform:none;line-height:20px;text-align:center}
 html[data-ui-stronger] .wtg9ga_newSessionLabelMask{grid-column:2;min-width:0;width:auto;max-width:100%;margin:0;padding:0;overflow:visible!important;mask-image:none!important}
 html[data-ui-stronger] .wtg9ga_newSessionContent{width:100%;max-width:100%;min-width:0;margin:0;padding:0;gap:0;justify-content:center;box-sizing:border-box}
 html[data-ui-stronger] .wtg9ga_newSessionLabel{flex:none;margin:0;padding:0;line-height:20px;text-align:center;letter-spacing:normal}
 html[data-ui-stronger] .wtg9ga_collapsed .wtg9ga_newSession{display:flex;align-items:center;justify-content:center;padding:0;gap:0}
 html[data-ui-stronger] .wtg9ga_collapsed .wtg9ga_newSession:before,html[data-ui-stronger] .wtg9ga_collapsed .wtg9ga_newSession:after{content:none}
 html[data-ui-stronger] .wtg9ga_collapsed .wtg9ga_newSession svg{display:block;width:16px;height:16px}
 @media(max-width:560px){.zs-page-transition>:is(.zw-panel,.zs-thinking){padding:20px 18px 26px}.zs-tools>.zs-surface-header{padding:12px 18px}.zs-file-picker{padding:14px;gap:12px}.zs-file-picker .zs-file-copy{flex-basis:100%}}
 @media(prefers-reduced-motion:reduce){.zs-switch-track i{transition:none}}

 /* Shared page and dialog controls. Keep these rules confined to owned surfaces. */
 :is(.zw-panel,.zs-thinking,.zs-palette,.zs-delete-dialog,.zs-workspace-dialog){font-family:var(--hud-mono,ui-monospace,Consolas,"Microsoft YaHei UI",sans-serif);font-size:13px;line-height:1.7;font-weight:400;color:var(--zw-ink,var(--dsw-alias-text-primary,#242426));letter-spacing:normal}
 :is(.zw-panel,.zs-thinking){box-sizing:border-box;max-width:760px;padding:24px}
 :is(.zw-panel,.zs-thinking)>header{display:flex;align-items:center;gap:16px;margin:0 0 24px;padding:0 0 20px;border-bottom:1px solid var(--zw-line,#dedee2)}
 :is(.zw-panel,.zs-thinking)>header :is(h2,p){margin:0}
 :is(.zw-panel,.zs-thinking)>header h2{font-size:20px;font-weight:500;line-height:1.4;letter-spacing:normal}
 :is(.zw-panel,.zs-thinking)>header small{font-size:10px;line-height:1.6;letter-spacing:.08em;color:var(--zw-muted,#74747c)}
 :is(.zw-panel,.zs-thinking,.zs-palette) h3{font-size:14px;font-weight:500;line-height:1.5;letter-spacing:normal}
 :is(.zw-panel,.zs-thinking,.zs-palette) :is(p,li){font-size:12px;line-height:1.8;letter-spacing:normal;text-align:start;overflow-wrap:anywhere}
 :is(.zw-panel,.zs-thinking,.zs-palette) :is(small,.zs-subtle,.zw-note,.zw-notice){font-size:11px;line-height:1.7;letter-spacing:normal;color:var(--zw-muted,#74747c)}
 :is(.zw-panel,.zs-thinking,.zs-palette,.zs-delete-dialog,.zs-workspace-dialog) button:not([role=switch]):not([role=option]):not(.zs-icon-button){box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;gap:7px;min-height:34px!important;max-width:100%;margin:0;padding:6px 12px;border:1px solid var(--zw-line,#dedee2);border-radius:6px;background:var(--zw-paper,#fafafa);color:var(--zw-ink,#242426);font:inherit;font-size:12px;font-weight:400;line-height:20px;letter-spacing:normal;text-align:center;vertical-align:middle;white-space:normal;overflow-wrap:anywhere;cursor:pointer}
 :is(.zw-panel,.zs-thinking,.zs-palette,.zs-delete-dialog,.zs-workspace-dialog) button:not([role=switch]):not([role=option])::before,
 :is(.zw-panel,.zs-thinking,.zs-palette,.zs-delete-dialog,.zs-workspace-dialog) button:not([role=switch]):not([role=option])::after{content:none!important}
 :is(.zw-panel,.zs-thinking,.zs-palette,.zs-delete-dialog,.zs-workspace-dialog) button:disabled{opacity:.45;cursor:default}
 :is(.zw-panel,.zs-thinking,.zs-palette,.zs-delete-dialog,.zs-workspace-dialog) button:not(:disabled):not([role=switch]):hover{border-color:var(--zw-purple,#a99abe);background:var(--zw-soft,#eeebf3)}
 :is(.zw-panel,.zs-thinking,.zs-palette,.zs-delete-dialog,.zs-workspace-dialog) button:focus-visible{outline:2px solid var(--zw-purple,#a99abe);outline-offset:2px}
 :is(.zw-panel,.zs-thinking,.zs-palette) :is(input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=file]),select,textarea){box-sizing:border-box;min-width:0;max-width:100%;border:1px solid var(--zw-line,#dedee2);border-radius:6px;background:var(--zw-paper,#fafafa);color:var(--zw-ink,#242426);font:inherit;font-size:12px;line-height:20px;letter-spacing:normal;padding:8px 11px;min-height:38px}
 :is(.zw-panel,.zs-thinking,.zs-palette) textarea{resize:vertical;min-height:88px}
 :is(.zw-panel,.zs-thinking,.zs-palette) :is(input,select,textarea):disabled{opacity:.55;cursor:default}
 :is(.zw-panel,.zs-thinking,.zs-palette) :is(input,select,textarea):focus-visible{outline:2px solid var(--zw-purple,#a99abe);outline-offset:2px}
 :is(.zw-panel,.zs-thinking,.zs-palette) :is(input[type=checkbox],input[type=radio]){width:14px;height:14px;flex:none;accent-color:var(--zw-purple,#a99abe)}
 :is(.zw-panel,.zs-thinking) .zw-row-actions{display:flex;align-items:center;flex-wrap:wrap;gap:8px;margin:16px 0}
 :is(.zw-panel,.zs-thinking) :is(label,legend,summary){font-size:12px;line-height:1.7;letter-spacing:normal}
 :is(.zw-panel,.zs-thinking) summary{cursor:pointer;text-align:start}
 :is(.zw-panel,.zs-thinking) fieldset{min-width:0;margin:18px 0;padding:0;border:0}
 :is(.zw-panel,.zs-thinking) legend{margin-bottom:10px;padding:0;font-weight:500}
 :is(.zw-panel,.zs-thinking,.zs-palette) .zw-error{color:var(--dsw-alias-state-error-primary,#ad475d);font-size:12px;line-height:1.7;overflow-wrap:anywhere}
 .zs-palette>header{display:flex;align-items:center;gap:14px;padding:18px 20px;border-bottom:1px solid var(--zw-line,#dedee2)}
 .zs-palette>header h2{flex:1;margin:0;font-size:16px;font-weight:500;line-height:1.5;letter-spacing:normal}
 .zs-palette>footer{display:flex;align-items:center;justify-content:flex-end;gap:8px;flex-wrap:wrap;margin:0;padding:16px 20px;border-top:1px solid var(--zw-line,#dedee2);font-size:11px;line-height:1.6}
 .zs-palette.zw-edit-dialog>p{margin:16px 20px;padding:0}
 .zs-palette.zw-edit-dialog>textarea{margin:0 20px 20px;width:calc(100% - 40px)}
 .zs-usage-stats{border-radius:8px;overflow:hidden}
 .zs-usage-stats>div{padding:16px;box-sizing:border-box}
 .zs-usage-stats strong{font-variant-numeric:tabular-nums;font-weight:500}
 .zs-import-preview,.zs-import-reader,.zw-record-editor{border:1px solid var(--zw-line,#dedee2);border-radius:8px;background:var(--zw-paper,#fafafa);padding:18px;box-shadow:none}
 .zs-tools .zs-page-transition>:is(.zw-panel,.zs-thinking){max-width:none;width:100%;padding:24px}
 .zs-tools>.zs-surface-header{min-height:68px;padding:16px 24px}
 .zs-command-results button[role=option]{font:inherit;font-size:12px;line-height:1.7}
 .zs-palette>.zs-command-results button[role=option]{border-radius:6px}
 .zs-delete-dialog .zs-delete-copy{font-size:12px;line-height:1.8}
 @media(max-width:540px){:is(.zw-panel,.zs-thinking){padding:20px 16px}.zs-tools .zs-page-transition>:is(.zw-panel,.zs-thinking){padding:20px 18px}.zs-tools>.zs-surface-header{padding:14px 18px}.zs-usage-stats{grid-template-columns:repeat(2,minmax(0,1fr))}.zs-usage-stats>div{padding:14px}.zs-usage-stats strong{font-size:20px}.zs-palette>header,.zs-palette>footer{padding:16px}.zs-palette.zw-edit-dialog>p{margin:14px 16px}.zs-palette.zw-edit-dialog>textarea{margin:0 16px 16px;width:calc(100% - 32px)}}
 .zs-preset-entry{display:inline-flex;align-items:center;gap:8px;min-width:0}
 html[data-ui-stronger] .zs-preset-menu-list{--dsw-menu-surface-fill:var(--zw-paper,var(--dsw-alias-bg-base,#fafafa));--dsw-menu-backdrop-filter:none;background:var(--zw-paper,var(--dsw-alias-bg-base,#fafafa));border:1px solid var(--zw-line,var(--dsw-alias-border-l2,#dedee2));border-radius:6px!important;box-shadow:0 4px 14px #0000000c}
 .zs-preset-menu-anchor{display:inline-flex;min-width:0;max-width:100%}
 .zs-preset-chevron{margin-inline-start:5px;font-size:10px;color:var(--zw-muted,var(--dsw-alias-label-secondary))}
 .zs-preset-menu-item{display:flex;flex-direction:column;gap:3px;width:230px;max-width:calc(100vw - 80px);padding:2px 0;font:12px/1.65 var(--hud-mono,ui-monospace,Consolas,"Microsoft YaHei UI",sans-serif);letter-spacing:normal;text-align:start}
 .zs-preset-menu-name{display:block;text-align:left;font-weight:400}
 .zs-preset-menu-name small,.zs-preset-menu-description{font-size:11px;line-height:1.6;font-weight:400;color:var(--dsw-alias-label-secondary,var(--zw-muted,#74747c))}
 .zs-preset-menu-description{white-space:normal;overflow-wrap:anywhere}
 .zs-preset-status{max-width:260px;font:11px/1.6 var(--hud-mono,ui-monospace,monospace);color:var(--zw-muted,#74747c);overflow-wrap:anywhere}
 .zs-preset-error{color:var(--dsw-alias-state-error-primary,#ad475d)}

 html[data-ui-stronger] .zs-wechat-memory{margin:20px 0;min-width:0}
 html[data-ui-stronger] .zs-memory-choices{margin:12px 0;padding:8px 0;max-height:248px;overflow:auto;border:1px solid var(--zw-line);border-radius:6px;min-width:0}
 html[data-ui-stronger] .zs-memory-choices legend{padding:0 8px;font-size:11px;color:var(--zw-muted)}
 html[data-ui-stronger] .zs-memory-choices label{display:flex;align-items:center;gap:10px;padding:9px 12px;min-width:0;cursor:pointer}
 html[data-ui-stronger] .zs-memory-choices label:hover{background:var(--zw-panel)}
 html[data-ui-stronger] .zs-memory-choices label>span{min-width:0;overflow-wrap:anywhere;font-size:12px;line-height:1.65}
 html[data-ui-stronger] .zs-memory-choices small{display:block;color:var(--zw-muted);font-size:11px;line-height:1.65;margin-top:2px}
 html[data-ui-stronger] .zs-memory-choices input{flex:none;width:14px;height:14px;min-height:0;margin:0;accent-color:var(--zw-purple)}
 html[data-ui-stronger] .zs-memory-choices>p{padding:0 12px}

 html[data-ui-stronger] .an3WzG_body{--dsh-chat-content-width:var(--dsh-chat-user-width,clamp(0px,calc(var(--dsh-conversation-column-width,100vw) - clamp(32px,5vw,120px)),1600px));--dsh-composer-card-max-width:calc(var(--dsh-chat-content-width) + 24px);--dsh-composer-side-clearance:clamp(12px,2vw,24px)}
 html[data-ui-stronger] .zw-entries article>.zw-row-actions{flex:none;flex-wrap:wrap;justify-content:flex-end}
 .zs-workspace-dialog .zs-form-field{display:grid;gap:8px;font-size:12px;line-height:1.7}
 .zs-workspace-dialog input{box-sizing:border-box;width:100%;min-width:0;min-height:36px;padding:8px 10px;border:1px solid var(--zw-line,#dedee2);border-radius:6px;background:var(--zw-paper,#fafafa);color:var(--zw-ink,#242426);font:inherit;font-size:12px;line-height:1.6}
 .zs-workspace-dialog input:focus-visible{outline:2px solid var(--zw-purple,#b7a8ca);outline-offset:2px}
 @media(max-width:560px){html[data-ui-stronger] .zw-entries article{flex-wrap:wrap;gap:10px}html[data-ui-stronger] .zw-entries article>.zw-row-actions{justify-content:flex-start}}
 html[data-ui-stronger] .wnFoaW_projectRow .wnFoaW_rowActions{display:inline-flex!important}
 html[data-ui-stronger] .wnFoaW_projectRow[data-zs-loose-removed=true]{display:none!important}
 .zs-folder-seat{display:inline-flex;align-items:center}
 .zs-folder-menu-button{display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;padding:0;border:0;border-radius:5px;background:transparent;color:var(--dsw-alias-label-tertiary,var(--zw-muted));cursor:pointer}
 .zs-folder-menu-button:hover{background:var(--zw-soft);color:var(--zw-ink)}
 .zs-folder-menu-button:focus-visible{outline:2px solid var(--zw-purple);outline-offset:1px}
 .zs-folder-menu-label{display:flex;align-items:center;gap:8px;font-family:inherit;font-size:12px;line-height:1.7}
 .zs-loose-management{padding:12px 0;border-bottom:1px solid var(--zw-line);display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
 .zs-loose-management small{display:block;color:var(--zw-muted);font-size:11px}

 [data-session-stats-usage]>[data-zs-cache-row=ratio]{order:0}
 [data-session-stats-usage]>[data-zs-cache-row=hit]{order:1}
 [data-session-stats-usage]>[data-zs-cache-row=miss]{order:2}
 [data-session-stats-usage]>[data-zs-cache-row=write]{order:3}
 [data-session-stats-usage]>[data-zs-cache-row=output]{order:4}
 .zs-delete-body{padding:24px}
 .zs-delete-body h2{margin:0 0 18px;font-size:16px;font-weight:500;line-height:1.6}
 .zs-delete-body p{font-size:12px;line-height:1.8;margin:12px 0}
 .zs-delete-actions{display:flex;justify-content:flex-end;gap:10px;padding:16px 24px;border-top:1px solid var(--zw-line,#dedee2)}
 .zs-workspace-dialog button[class*=_close_]{min-height:28px!important;width:28px;height:28px;padding:0!important;border:0!important;background:transparent!important}
 .zs-workspace-dialog button[class*=_close_] svg{width:14px;height:14px;flex-shrink:0}
 .zs-review-settings{display:grid;gap:12px;padding-bottom:20px;border-bottom:1px solid var(--zw-line);margin-bottom:20px}
 .zs-review-settings>.zs-form-field,.zs-review-settings>.zw-row-actions,.zs-review-settings>p{margin:0}
 .zs-delete-dialog{padding:0!important;gap:0!important}
 .zs-meter progress::-webkit-progress-bar{background:var(--zw-line);border-radius:3px}
 .zs-meter progress::-webkit-progress-value{background:var(--zw-purple);border-radius:3px}
 .zs-meter progress::-moz-progress-bar{background:var(--zw-purple)}

`;
 function wireEntryOwnership(ctx){ctx.effect(()=>{const attribute='data-ui-stronger-native-shortcuts',sync=()=>{const actions=ctx.slots.entriesOfSlot('sidebar.panellist.actions');document.documentElement.toggleAttribute(attribute,actions.length>0&&actions.every(e=>e.options.id==='entry-customization'));};const off=ctx.slots.subscribe('sidebar.panellist.actions',sync);sync();return ()=>{off();document.documentElement.removeAttribute(attribute);};},'ui-stronger: one plugin navigation destination');}
 function cacheHitReading(usage){
  if(!usage)return null;
  const values=[usage.uncachedInputTokens,usage.cacheReadTokens,usage.cacheWriteTokens];
  if(values.some(value=>!Number.isSafeInteger(value)||value<0))return null;
  const prompt=values.reduce((sum,value)=>sum+value,0);
  return Number.isSafeInteger(prompt)&&prompt>0?(usage.cacheReadTokens/prompt*100).toFixed(1):null;
 }
 function CacheReading({root,usage,t}){
  React.useEffect(()=>{
   const reading=cacheHitReading(usage),owned=new Map(),attributes=new Map();
   const setRow=(node,value)=>{
    const actual=node.getAttribute('data-zs-cache-row'),prior=attributes.get(node);
    if(!prior)attributes.set(node,{original:actual,applied:value});
    else{if(actual!==prior.applied)prior.original=actual;prior.applied=value;}
    if(actual!==value)node.setAttribute('data-zs-cache-row',value);
   };
   const setText=(node,value)=>{
    const prior=owned.get(node);
    if(!prior)owned.set(node,{original:node.textContent,applied:value});
    else{if(node.textContent!==prior.applied)prior.original=node.textContent;prior.applied=value;}
    if(node.textContent!==value)node.textContent=value;
   };
   const sync=()=>{
    if(!root.current?.querySelector('[data-composer-stat="usage"] button[aria-expanded="true"]'))return;
    const table=document.querySelector('[data-session-stats-usage]');if(!table)return;
    const pairs=[...table.children];
    const labels=new Map([['命中缓存','hit'],['未命中缓存','miss'],[t('message.turnUsage.cacheHit'),'ratio'],[t('message.turnUsage.output'),'output'],[t('message.turnUsage.cacheWrite'),'write']]);
    for(let i=0;i<pairs.length-1;i++){
     const term=pairs[i],value=pairs[i+1];if(term.tagName!=='DT'||value.tagName!=='DD')continue;
     const kind=labels.get(term.textContent);if(!kind)continue;
     setRow(term,kind);setRow(value,kind);
     if(kind==='ratio'&&reading!==null)setText(value,reading+'%');
    }
   };
   const observer=new MutationObserver(sync);observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['aria-expanded']});sync();
   return()=>{
    observer.disconnect();
    for(const [node,value]of owned)if(node.textContent===value.applied)node.textContent=value.original;
    for(const [node,value]of attributes)if(node.getAttribute('data-zs-cache-row')===value.applied){if(value.original===null)node.removeAttribute('data-zs-cache-row');else node.setAttribute('data-zs-cache-row',value.original);}
   };
  },[root,usage,t]);
  return null;
 }
 function wireCacheReading(ctx){ctx.effect(()=>{
  let dispose,installing=false;
  const attach=()=>{
   if(dispose||installing)return;
   const entry=ctx.slots.entriesOfSlot('conversation.composer.dock').find(row=>row.options?.id==='usage');
   if(!entry?.component)return;
   const Original=entry.component;
   function UsageAdapter(props){
    const root=React.useRef(null),usage=props.useProjection('tokenUsage'),reading=cacheHitReading(usage);
    const translate=React.useCallback((key,args)=>key==='message.turnUsage.cacheRead'?'命中缓存':key==='message.turnUsage.input'?'未命中缓存':key==='stats.cacheHit'&&reading!==null?props.t(key,{...args,percent:reading}):props.t(key,args),[props.t,reading]);
    return h('span',{ref:root,style:{display:'contents'}},h(Original,{...props,t:translate}),h(CacheReading,{root,usage,t:translate}));
   }
   installing=true;
   try{dispose=ctx.slots.register({...entry.options,name:'conversation.composer.dock',inject:entry.inject??entry.options.inject,locale:entry.locale??entry.options.locale,...entry.store?{store:entry.store}:{},priority:Math.min(-100,(entry.options.priority??0)-1)},UsageAdapter);}
   finally{installing=false;}
  };
  const off=ctx.slots.subscribe('conversation.composer.dock',attach);attach();
  return()=>{off();dispose?.();};
 },'ui-stronger: precise cache reading');}
 function wireNativeCatalog(ctx,{timeout=16000}={}){
  ctx.inject(['modelDirectories'],scope=>{
   const catalog=scope.get('modelDirectories')?.catalog;if(!catalog?.load||!catalog.store?.getSnapshot||!catalog.invalidate)return;
   const original=catalog.load,timers=new Map();let disposed=false;
   const load=function(...args){
    if(disposed)return original.apply(this,args);
    const state=catalog.store.getSnapshot();if(state.status==='ready'&&state.value?.failures?.length)catalog.invalidate();
    const operation=Promise.resolve(original.apply(this,args)),epoch=catalog.generation;
    return new Promise((resolve,reject)=>{const timer=setTimeout(()=>{timers.delete(timer);if(!disposed&&epoch===catalog.generation&&catalog.store.getSnapshot().status==='loading'){const value=catalog.store.getSnapshot().value;catalog.invalidate();catalog.store.set({value,status:'error',error:'模型列表读取超时，请重试。'});}reject(Error('模型列表读取超时'));},timeout);timers.set(timer,reject);operation.then(resolve,reject).finally(()=>{clearTimeout(timer);timers.delete(timer);});});
   };
   scope.effect(()=>{catalog.load=load;return ()=>{disposed=true;for(const [timer,reject] of timers){clearTimeout(timer);reject(Error('模型目录适配已关闭'));}timers.clear();if(catalog.load===load)catalog.load=original;};});
  });
 }
 // Preserve the native provider editor and its injected store; add honest wait/retry feedback.
 function wireModelSettingsProgress(ctx,{delay=6000}={}){ctx.effect(()=>{
  let dispose,installing=false;const attach=()=>{if(dispose||installing)return;const entry=ctx.slots.entriesOfSlot('settings.section').find(e=>e.options?.id==='models');if(!entry||typeof entry.component!=='function'||typeof (entry.inject??entry.options?.inject)!=='function')return;const Original=entry.component;
   function Progress(props){if(!props.useSnapshot||!props.controller)return h(Original,props);const state=props.useSnapshot(s=>s),[stalled,setStalled]=React.useState(false);React.useEffect(()=>{setStalled(false);if(!['idle','loading'].includes(state.status))return;const timer=setTimeout(()=>setStalled(true),delay);return()=>clearTimeout(timer);},[state.status]);const waiting=['idle','loading'].includes(state.status);return h(React.Fragment,null,h(Original,props),waiting?h('div',{className:'zs-model-wait',role:'status'},stalled?'供应商设置读取较慢。可重试，已有配置不会被清空。':'正在读取供应商与模型设置…',stalled?h(Button,{variant:'outline',onClick:()=>{setStalled(false);void props.controller.load().catch(()=>{});}},'重试'):null):null);}
   installing=true;try{dispose=ctx.slots.register({...entry.options,name:'settings.section',id:'models',inject:entry.inject??entry.options.inject,locale:entry.locale??entry.options.locale,...entry.store?{store:entry.store}:{},priority:Math.min(-100,(entry.options.priority??0)-1)},Progress);}finally{installing=false;}
  };const off=ctx.slots.subscribe('settings.section',attach);attach();return()=>{off();dispose?.();};
 },'ui-stronger: native provider loading feedback');}
 async function selectPreset(ctx,sessionId,id,selectNative){
  if(typeof id!=='string'||!id)throw Error('请选择模式');
  if(!sessionId){
   if(id==='team')throw Error('请先选择工作区，再使用团队模式');
   if(typeof selectNative!=='function')throw Error('新会话模式入口尚未就绪');
   const refusal=await selectNative(id);if(refusal)throw Error(String(refusal));
   return {sessionId:null,requested:id,current:id,pending:false};
  }
  return callControl(ctx,'selectSessionPreset',{sessionId,presetId:id});
 }
 function presetCopy(row,translate){
  const names={standard:'标准模式',ptc:'PTC 模式',minimal:'极简模式',cordis:'创造模式',team:'团队模式'};
  const keys={standard:'Standard',ptc:'Ptc',minimal:'Minimal',cordis:'Cordis'};
  const text=(value,fallback)=>typeof value==='string'?value:value?.zh??value?.en??fallback;
  if(row.name===undefined&&keys[row.id]&&translate)return {name:translate('preset'+keys[row.id]+'Name'),description:translate('preset'+keys[row.id]+'Description')};
  return {name:text(row.name,names[row.id]??row.id),description:text(row.description,'')};
 }
 const modeIntents=new WeakMap();
 function publishMode(ctx,detail){let values=modeIntents.get(ctx);if(!values){values=new Map();modeIntents.set(ctx,values);}values.set(detail.sessionId,detail);if(values.size>128)values.delete(values.keys().next().value);window.dispatchEvent(new CustomEvent('ui-stronger-mode-change',{detail}));}
 function PresetPicker({ctx,sessionId,current,label,selectNative,codingTools=true,translate}){
  const [rows,setRows]=React.useState(null),[open,setOpen]=React.useState(false),[busy,setBusy]=React.useState(false),[error,setError]=React.useState(''),[selection,setSelection]=React.useState(null),[statusError,setStatusError]=React.useState(''),[statusBusy,setStatusBusy]=React.useState(false),[statusVersion,setStatusVersion]=React.useState(0);
  const writing=React.useRef(false),alive=React.useRef(true),readVersion=React.useRef(0);
  React.useEffect(()=>{alive.current=true;return ()=>{alive.current=false;};},[]);
  React.useEffect(()=>{
   if(!sessionId||writing.current)return;
   let active=true;const version=++readVersion.current;setStatusBusy(true);const controller=new AbortController();
   callControl(ctx,'sessionPresetStatus',{sessionId},controller.signal).then(value=>{if(active&&version===readVersion.current&&!writing.current){setSelection(value);setStatusError('');}}).catch(e=>{if(active&&version===readVersion.current&&!controller.signal.aborted)setStatusError(e.message);}).finally(()=>{if(active&&version===readVersion.current)setStatusBusy(false);});
   return()=>{active=false;controller.abort();};
  },[ctx,sessionId,current,open,statusVersion]);
  React.useEffect(()=>{if(!statusError)return;const timer=setTimeout(()=>setStatusVersion(value=>value+1),5000);return()=>clearTimeout(timer);},[statusError,statusVersion]);
  React.useEffect(()=>{const off=ctx.connection.state?.subscribe?.(()=>{if(ctx.connection.state.getSnapshot()==='connected')setStatusVersion(value=>value+1);});return()=>off?.();},[ctx]);
  React.useEffect(()=>{
   if(!open)return;
   let active=true,timer;setError('');
   Promise.race([Promise.resolve().then(()=>{
    const remote=ctx.get('remote.agentPresets');if(!remote?.list)throw Error('宿主模式列表尚未就绪');return remote.list();
   }),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('模式列表读取超时，请重新打开')),15000);})]).then(result=>{
    if(!active)return;if(!result.ok)throw Error(result.error?.message||'模式列表读取失败');
    const available=(result.value.presets??[]).filter(row=>!row.broken),standard=available.some(row=>row.id==='standard');
    setRows([...available.filter(row=>row.id!=='team'&&(codingTools||row.name!==undefined||!['ptc','minimal'].includes(row.id))).map(row=>({...row,...presetCopy(row,translate)})),{id:'team',name:'团队模式',disabled:!sessionId||!standard,description:!sessionId?'选择工作区后即可使用团队模式':!standard?'标准模式暂不可用':'主协调员分配任务、跟进阶段汇报与交接'}]);
   }).catch(e=>{if(active)setError(e.message);}).finally(()=>clearTimeout(timer));
   return ()=>{active=false;clearTimeout(timer);};
  },[ctx,sessionId,open,codingTools,translate]);
  const text=(value,fallback)=>typeof value==='string'?value:value?.zh??value?.en??fallback;
  const apply=async id=>{
   if(writing.current||!rows?.some(row=>row.id===id&&!row.disabled))return;
   writing.current=true;readVersion.current++;setBusy(true);setError('');
   const previous=selection?.requested??selection?.current??current;
   setSelection({sessionId,requested:id,current:selection?.current??current,pending:true,pendingReason:'saving'});
   setOpen(false);publishMode(ctx,{sessionId,presetId:id,pending:true});
   try{const result=await selectPreset(ctx,sessionId,id,selectNative);if(alive.current){readVersion.current++;setSelection(result);setStatusError('');setOpen(false);publishMode(ctx,{sessionId,presetId:id});}}
   catch(e){if(alive.current){setError(e.message);setSelection(null);publishMode(ctx,{sessionId,presetId:previous});setStatusVersion(value=>value+1);}}
   finally{writing.current=false;if(alive.current)setBusy(false);}
  };
  const items=rows?.length?rows.map(row=>({id:row.id,disabled:busy||row.disabled,label:h('span',{className:'zs-preset-menu-item'},h('span',{className:'zs-preset-menu-name'},text(row.name,({standard:'标准模式',ptc:'PTC 模式',minimal:'极简模式',cordis:'创造模式',team:'团队模式'})[row.id]??row.id)),row.description?h('span',{className:'zs-preset-menu-description'},text(row.description,'')):null)})):[{id:'ui-stronger-preset-status',disabled:true,label:error?'读取失败，请重新打开':rows?'暂无可用模式':'正在读取模式…'}];
  return h('span',{className:'zs-preset-entry'},h(Menu,{
   open,onClose:()=>setOpen(false),items,selectedId:selection?.requested??current,onSelect:id=>void apply(id),align:'start',portal:true,className:'zs-preset-menu-anchor',listClassName:'zs-preset-menu-list',
   anchor:h('button',{type:'button',className:'zs-team-entry','aria-label':'切换智能体模式','aria-haspopup':'menu','aria-expanded':open,disabled:busy,title:'切换当前会话模式和视图；有未完成任务时在下次发送消息时应用',onClick:()=>setOpen(value=>!value)},(selection?.requested??current)==='team'?h(TeamSymbol,{coordinator:true}):null,selection?.requested?text(rows?.find(row=>row.id===selection.requested)?.name,({standard:'标准模式',ptc:'PTC 模式',minimal:'极简模式',cordis:'创造模式',team:'团队模式'})[selection.requested??selection.current]??selection.requested??selection.current):label,h('span',{'aria-hidden':true,className:'zs-preset-chevron'},'⌄'))
  }),statusBusy&&!selection?h('span',{className:'zs-preset-status',role:'status'},'同步模式…'):null,selection?.pending&&!busy?h('span',{className:'zs-preset-status',role:'status'},selection.pendingReason==='next-user-message'?'下次发送消息时应用':'待会话准备'):null,busy?h('span',{className:'zs-preset-status',role:'status'},'切换中…'):null,(error||statusError)?h('span',{className:'zs-preset-status zs-preset-error',role:'alert'},error||'模式状态暂不可用，正在重试',h('button',{type:'button',onClick:()=>setStatusVersion(value=>value+1)},'重试')):null);
 }
 function wirePresetEntry(ctx){ctx.effect(()=>{
  let active=true;
  const mounted=new Map(),installing=new Set();
  const slots=['conversation.session.header.actions','conversation.hero.agentPreset'];
  const attach=()=>{for(const name of slots){
   if(mounted.has(name)||installing.has(name))continue;
   const entry=ctx.slots.entriesOfSlot(name).find(row=>typeof row.component==='function'&&(name==='conversation.hero.agentPreset'||row.options?.id==='agent-preset'));
   if(!entry)continue;
   const Original=entry.component;
   function PresetEntry(props){
    const session=props.useSessions?props.useSessions(state=>state.byId[props.sessionId]):null;
    if(!active)return h(Original,props);
    return h(PresetPicker,{key:props.sessionId,ctx,sessionId:props.sessionId,current:session?.projectionValues?.agentPreset,label:h(Original,props),translate:props.t});
   }
   function HeroPresetEntry(props){
    const state=props.useAgentPresetSeat?props.useAgentPresetSeat(value=>value):null;
    const codingTools=props.useDeveloperTools?props.useDeveloperTools(value=>value):true;
    const main=props.useSessionRetainInfo?props.useSessionRetainInfo(info=>props.sessionId===undefined||(info?.retainedBy.mainView??0)>0):true;
    React.useEffect(()=>{if(active&&props.load)void Promise.resolve(props.load()).catch(()=>{});},[props.load]);
    if(!active||!state||!Array.isArray(state.options))return h(Original,props);
    if(!main)return null;
    const chosen=state.options.find(row=>row.id===state.current);
    const label=state.current?presetCopy(chosen??{id:state.current},props.t).name:'选择模式';
    return h(PresetPicker,{key:props.sessionId??'draft',ctx,sessionId:props.sessionId,current:state.current,label,selectNative:props.select,codingTools,translate:props.t});
   }
   installing.add(name);
   try{mounted.set(name,ctx.slots.register({...entry.options,name,inject:entry.inject??entry.options.inject,locale:entry.locale??entry.options.locale,...entry.store?{store:entry.store}:{},priority:Math.min(-100,(entry.options.priority??0)-1)},name==='conversation.hero.agentPreset'?HeroPresetEntry:PresetEntry));}
   finally{installing.delete(name);}
  }};
  const subscriptions=slots.map(name=>ctx.slots.subscribe(name,attach));attach();
  return()=>{active=false;subscriptions.forEach(off=>off());[...mounted.values()].reverse().forEach(off=>off());};
 },'ui-stronger: native preset picker');}
 async function callControlOnce(ctx,action,payload={},signal){
  let r;
  try{r=await ctx.connection.rpc.call('/api','ui-stronger/'+action,payload,requestSignal(action,signal));}
  catch(e){
   const missing=/^transport failure for \/api\/ui-stronger\/[\w]+: HTTP (404|405)$/.test(e?.message??'');
   if(!missing)throw e;
   if(action==='teamPolicyStatus'&&payload.sessionId){
    const view=await callControl(ctx,'bots',{},signal);
    if(!view.policies||!view.defaultPolicy)throw Error('运行端版本较旧，请正常重启 DSH 后再使用子智能体开关');
    return {sessionId:payload.sessionId,revision:view.revision,policy:view.policies[payload.sessionId]??view.defaultPolicy,editable:true,available:!!view.capabilities?.spawn,reason:view.capabilities?.spawn?'':'当前宿主未提供子智能体服务'};
   }
   if(!/^(https?:|dsh-app:)$/.test(window.location?.protocol??''))throw e;
   r=await ctx.connection.rpc.call('/ui-stronger',action,payload,requestSignal(action,signal));
  }
  if(!r.ok)throw new Error(r.error.message);
  return r.value;
 }
 function pauseRead(ms,signal){return new Promise((resolve,reject)=>{
  if(signal?.aborted){reject(signal.reason);return;}
  const abort=()=>{clearTimeout(timer);reject(signal.reason);};
  const timer=setTimeout(()=>{signal?.removeEventListener('abort',abort);resolve();},ms);
  signal?.addEventListener('abort',abort,{once:true});
 });}
 async function callControl(ctx,action,payload={},signal){
  const retry=['sessionPresetStatus','teamPolicyStatus','teamView','status'].includes(action);
  const deadline=requestSignal(action,signal),delays=[200,500,1000,2000,3000];
  if(ctx.connection.state?.getSnapshot&&ctx.connection.state.getSnapshot()!=='connected'){
   while(ctx.connection.state.getSnapshot()!=='connected'){deadline.throwIfAborted();await pauseRead(150,deadline);}
  }
  for(let attempt=0;;attempt++){
   deadline.throwIfAborted();
   try{return await callControlOnce(ctx,action,payload,deadline);}
   catch(error){
    const unavailable=/^transport failure for \/(?:api\/ui-stronger|ui-stronger)\/[\w]+: HTTP (404|405)$/.test(error?.message??'');
    if(!retry||!unavailable||attempt>=delays.length)throw error;
    await pauseRead(delays[attempt],deadline);
   }
  }
 }

 function requestSignal(action,signal){const timeout=AbortSignal.timeout(action==='wechatPoll'?60000:action==='wechatLogin'?45000:['speak','compactNow'].includes(action)?150000:action==='indexKnowledge'?120000:15000);return signal?AbortSignal.any([signal,timeout]):timeout;}
 const TERMINAL_CSS="/* Terminal hierarchy: quiet canvas, bounded controls, no decorative chrome. */\nhtml[data-ui-stronger]{--dsw-radius-xl:0px;--dsw-radius-lg:0px;--hud-mono:\"Cascadia Code\",\"SFMono-Regular\",Consolas,\"Microsoft YaHei UI\",monospace;--zw-line:#dedee2;--zw-muted:#727078;--zw-paper:#fafafa;--zw-panel:#f3f3f4;--zw-purple:#ad9bc0;--zw-deep:#76618e}\nhtml[data-ui-stronger] [data-ds-dark-theme],html[data-ui-stronger][data-ds-dark-theme]{--zw-paper:#141416;--zw-panel:#1a1a1d;--zw-line:#343438;--zw-muted:#a09ba8;--zw-ink:#e5e3e8;--zw-deep:#c2b0d2}\nhtml[data-ui-stronger] :where(.zw-panel,.zs-tools,.zs-palette,.zs-welcome,.zw-controls,.zs-process,.zs-home-modules) :where(button,input,textarea,select,[role=dialog]:where(.zs-tools,.zs-tools *,.zs-palette,.zs-palette *,.zw-panel,.zw-panel *),[role=menu]:where(.zs-tools,.zs-tools *,.zs-palette,.zs-palette *,.zw-panel,.zw-panel *),[role=listbox]:where(.zs-tools,.zs-tools *,.zs-palette,.zs-palette *,.zw-panel,.zw-panel *),[role=tab],article){border-radius:var(--zw-radius)!important}\nhtml[data-ui-stronger] :where(.zw-panel,.zs-tools,.zs-palette,.zs-welcome,.zw-controls,.zs-process,.zs-home-modules) :where(button,input,textarea,select,[role=tab],nav,label,h1,h2,h3,.zs-shell-identity,.zw-controls){font-family:var(--hud-mono)!important}\nhtml[data-ui-stronger] :where(.zw-panel,.zs-tools,.zs-palette,.zs-welcome,.zw-controls,.zs-process,.zs-home-modules) :where(button,nav,[role=tab],label){font-size:12px;letter-spacing:.045em;font-weight:400}\nhtml[data-ui-stronger] :where(.zw-panel,.zs-tools,.zs-palette,.zs-welcome,.zw-controls,.zs-process,.zs-home-modules) :where(button,[role=tab],nav,h1,h2,h3){text-transform:uppercase}\nhtml[data-ui-stronger] :where(.zw-panel,.zs-tools,.zs-palette,.zs-welcome,.zw-controls,.zs-process,.zs-home-modules) :where(input,textarea,[contenteditable=true]){text-transform:none;letter-spacing:normal}\nhtml[data-ui-stronger] :where(.zw-panel,.zs-tools,.zs-palette,.zs-welcome,.zw-controls,.zs-process,.zs-home-modules) :where(button):focus-visible{outline:1px solid var(--zw-deep);outline-offset:3px}\nhtml[data-ui-stronger] :is(.zw-panel,.zs-tools,.zs-palette,.zs-process){font-family:var(--hud-mono);font-weight:400}\nhtml[data-ui-stronger] :is(.zw-panel,.zs-tools) :is(h2,h3){font-weight:400;letter-spacing:.12em}\nhtml[data-ui-stronger] .zs-quiet-tools{border:1px solid var(--zw-line);box-shadow:0 5px 20px #0000000d!important}\nhtml[data-ui-stronger] .zs-surface-header{min-height:56px;border-bottom:1px solid var(--zw-line);padding:16px 24px}\nhtml[data-ui-stronger] .zs-section-select{min-width:0;gap:16px}\nhtml[data-ui-stronger] .zs-section-select>span{font-size:10px;color:var(--zw-muted);letter-spacing:.16em}\nhtml[data-ui-stronger] .zs-section-select select{border:0;border-left:1px solid var(--zw-line);padding-left:16px;font-size:12px;max-width:min(280px,55vw)}\nhtml[data-ui-stronger] :is(.zw-panel,.zs-home-modules) button:not([role=switch]):not(.zs-icon-button):not(:has(svg:only-child)){border:0;border-bottom:1px solid var(--zw-line);background:transparent!important;box-shadow:none!important;gap:8px;min-height:32px;color:var(--zw-ink);padding:7px 8px}\nhtml[data-ui-stronger] :is(.zw-panel,.zs-home-modules) button:not([role=switch]):not(.zs-icon-button):not(:has(svg:only-child)):before{content:'[';color:var(--zw-muted);font-weight:400}\nhtml[data-ui-stronger] :is(.zw-panel,.zs-home-modules) button:not([role=switch]):not(.zs-icon-button):not(:has(svg:only-child)):after{content:']';color:var(--zw-muted);font-weight:400}\nhtml[data-ui-stronger] :is(.zw-panel,.zs-home-modules) button:hover:not(:disabled){color:var(--zw-deep);border-color:var(--zw-purple)}\nhtml[data-ui-stronger] .zw-panel button[role=switch]{width:38px;height:22px;min-height:22px;border:1px solid var(--zw-line);background:transparent;padding:3px}\nhtml[data-ui-stronger] .zw-panel button[role=switch]:before{width:12px;height:12px;background:var(--zw-muted);border-radius:var(--zw-radius)!important}\nhtml[data-ui-stronger] .zw-panel button[role=switch][aria-checked=true]:before{background:var(--zw-purple);transform:translateX(16px)}\nhtml[data-ui-stronger] .zw-panel :is(input,textarea,select){border:1px solid var(--zw-line);background:transparent;box-sizing:border-box;min-width:0}\nhtml[data-ui-stronger] .zw-panel :is(input,textarea):focus{border-color:var(--zw-purple)}\nhtml[data-ui-stronger] :is(.LOmM4q_bubble,[class*=\"_composerCard\"],[class*=\"_inputBar\"]){border-radius:var(--zw-radius)!important;border:1px solid var(--zw-line);box-shadow:0 2px 5px #00000003}\nhtml[data-ui-stronger] .LOmM4q_bubble{background:var(--zw-panel)!important}\nhtml[data-ui-stronger] .zs-quiet-home{align-items:flex-start;text-align:left;position:relative;gap:18px;padding:38px 36px;width:min(100%,610px);min-height:280px;border:1px solid var(--zw-line);background-image:radial-gradient(var(--zw-line) .65px,transparent .8px);background-size:18px 18px;box-shadow:0 3px 10px #00000003}\nhtml[data-ui-stronger] .zs-quiet-home>.zw-mark{width:30px;height:30px;opacity:1;color:var(--zw-ink);margin:10px 0 16px}\nhtml[data-ui-stronger] .zs-quiet-home h1{font:300 23px/1.5 var(--hud-mono);letter-spacing:.04em;margin:0}\nhtml[data-ui-stronger] .zs-start-hint{font:12px/1.9 var(--hud-mono);color:var(--zw-muted);margin:0;max-width:100%}\nhtml[data-ui-stronger] .hud-register{display:flex;width:100%;justify-content:space-between;gap:12px;font:9px/1.5 var(--hud-mono);letter-spacing:.14em;color:var(--zw-muted);text-transform:uppercase}\nhtml[data-ui-stronger] .hud-register-bottom{margin-top:24px;padding-top:12px;border-top:1px solid var(--zw-line)}\nhtml[data-ui-stronger] .hud-register i{display:inline-block;width:4px;height:4px;background:var(--zw-purple);margin-right:7px;transform:rotate(45deg)}\nhtml[data-ui-stronger] .zs-home-modules{width:100%;margin:4px 0 0}\nhtml[data-ui-stronger] .zs-home-modules>summary{text-align:left;border-bottom:1px solid var(--zw-line);padding:10px 0;letter-spacing:.08em}\nhtml[data-ui-stronger] .zs-home-modules .zs-launchers{margin:8px 0}\nhtml[data-ui-stronger] .zs-home-modules .zs-launchers button{justify-content:flex-start;text-align:left}\nhtml[data-ui-stronger] .zs-home-modules .zs-launchers button>span{flex:1;min-width:0;overflow-wrap:anywhere}\nhtml[data-ui-stronger] .zs-home-modules .zs-work-edit{margin-left:0}\nhtml[data-ui-stronger] .zs-shell-identity{gap:12px;font-family:var(--hud-mono)}\nhtml[data-ui-stronger] .zs-shell-identity strong{font-weight:500;letter-spacing:.1em}\nhtml[data-ui-stronger] .zs-shell-identity small{letter-spacing:.16em}\nhtml[data-ui-stronger] :is(.zs-module-row,.zw-record,.zs-meter,.zw-safety-state){background:transparent;border:0;border-bottom:1px solid var(--zw-line);box-shadow:none}\nhtml[data-ui-stronger] .zw-setting{gap:18px;padding:18px 0}\nhtml[data-ui-stronger] :is(.zw-panel,.zs-tools) :where(p,small){line-height:1.85}\n@media(max-width:650px){html[data-ui-stronger] .zs-quiet-home{padding:24px 20px;gap:14px;min-height:230px}html[data-ui-stronger] .zs-quiet-home h1{font-size:19px}html[data-ui-stronger] .zs-quiet-tools>.zw-panel{padding:22px 18px}html[data-ui-stronger] .hud-register{font-size:8px;letter-spacing:.08em}}\n\nhtml[data-ui-stronger] .wtg9ga_newSession{background:transparent!important;border:1px solid var(--zw-line)!important;box-shadow:none!important;color:var(--zw-ink)!important;display:flex;align-items:center;justify-content:space-between;padding:0 12px;gap:10px}\nhtml[data-ui-stronger] .wtg9ga_newSession:before{content:\"[\";color:var(--zw-muted)}html[data-ui-stronger] .wtg9ga_newSession:after{content:\"]\";color:var(--zw-muted)}html[data-ui-stronger] .wtg9ga_newSession svg{display:none}html[data-ui-stronger] .wtg9ga_newSession:hover{border-color:var(--zw-purple)!important;color:var(--zw-deep)!important}\n\nhtml[data-ui-stronger] .zw-panel :is(input,textarea,select){font-size:13px;line-height:1.6}\nhtml[data-ui-stronger] .zw-panel :is(label,summary){line-height:1.7}\nhtml[data-ui-stronger] .zw-panel button:not([role=\"switch\"]){transition:color .12s ease,border-color .12s ease,background-color .12s ease}\n@media(prefers-reduced-motion:reduce){html[data-ui-stronger] .zw-panel button{transition:none}}\n\n/* Soft facets: small control radii, quiet larger surfaces; preserve media masks. */\nhtml[data-ui-stronger]{--zw-radius:6px;--dsw-radius-xs:3px;--dsw-radius-sm:4px;--dsw-radius-md:6px;--dsw-radius-lg:8px;--dsw-radius-xl:10px}\nhtml[data-ui-stronger] :where(.zw-panel,.zs-tools,.zs-palette,.zs-welcome,.zw-controls,.zs-process,.zs-home-modules) :is(button,input:not([type=radio]),textarea,select,[role=button],[role=combobox],[role=tab],[role=menuitem]:where(.zs-tools,.zs-tools *,.zs-palette,.zs-palette *,.zw-panel,.zw-panel *),[role=option]:where(.zs-tools,.zs-tools *,.zs-palette,.zs-palette *,.zw-panel,.zw-panel *),[class*=\"_navCell\"],[class*=\"_sessionRow\"],[class*=\"_projectRow\"],.zs-module-row,.zs-icon-button,.wtg9ga_newSession){border-radius:6px!important}\nhtml[data-ui-stronger] :where(.zw-panel,.zs-tools,.zs-palette,.zs-welcome,.zw-controls,.zs-process,.zs-home-modules) :is([role=dialog]:where(.zs-tools,.zs-tools *,.zs-palette,.zs-palette *,.zw-panel,.zw-panel *),[role=menu]:where(.zs-tools,.zs-tools *,.zs-palette,.zs-palette *,.zw-panel,.zw-panel *),[role=listbox]:where(.zs-tools,.zs-tools *,.zs-palette,.zs-palette *,.zw-panel,.zw-panel *),[role=tooltip]:where(.zs-tools,.zs-tools *,.zs-palette,.zs-palette *,.zw-panel,.zw-panel *),.zs-quiet-tools,.zs-palette,.zs-quiet-home,.zw-connect,.zw-record-editor,[class*=\"_card\"],[class*=\"_Card\"],[class*=\"_composerCard\"],[class*=\"_inputBar\"],.LOmM4q_bubble){border-radius:10px!important}\nhtml[data-ui-stronger] :where(.zw-panel,.zs-tools,.zs-palette,.zs-welcome,.zw-controls,.zs-process,.zs-home-modules) :is([class*=\"_centerCol\"],[class*=\"_sidebarCol\"]){border-radius:0!important}\nhtml[data-ui-stronger] .zw-panel button[role=switch]:before{border-radius:3px!important}\nhtml[data-ui-stronger] :is(.zs-icon-button,.zs-extension-entry) svg{stroke-linecap:round;stroke-linejoin:round}\nhtml[data-ui-stronger] .zw-mark{display:block;flex-shrink:0;overflow:visible}\n\n/* Interaction motion: short travel, no continuous decoration. */\nhtml[data-ui-stronger-motion] .zs-surface-backdrop{animation:zs-shade-enter 180ms ease-out both}\nhtml[data-ui-stronger-motion] .zs-surface-backdrop>.zs-tools{animation:zs-drawer-enter 270ms cubic-bezier(.18,.85,.25,1) both}\nhtml[data-ui-stronger-motion] .zs-surface-backdrop>.zs-palette{animation:zs-palette-enter 220ms cubic-bezier(.18,.85,.25,1) both}\nhtml[data-ui-stronger-motion] .zs-page-transition{animation:zs-page-enter-enhanced 230ms cubic-bezier(.18,.85,.25,1) both}\nhtml[data-ui-stronger-motion] .zs-surface-backdrop[data-leaving]{pointer-events:auto;animation:zs-fade-out 180ms ease-in both}\nhtml[data-ui-stronger-motion] .zs-surface-backdrop[data-leaving]>.zs-tools{pointer-events:none;animation:zs-drawer-exit 180ms cubic-bezier(.4,0,.8,.4) both}\nhtml[data-ui-stronger-motion] .zs-surface-backdrop[data-leaving]>.zs-palette{pointer-events:none;animation:zs-palette-exit 180ms ease-in both}\nhtml[data-ui-stronger-motion] :is(.zs-quiet-tools,.zs-palette) button:not([role=switch]){transition:transform 150ms cubic-bezier(.2,.8,.2,1),color 140ms ease,border-color 140ms ease,background-color 140ms ease}\n@media(hover:hover){html[data-ui-stronger-motion] :is(.zs-quiet-tools,.zs-palette) button:not([role=switch]):not(:disabled):hover{transform:translateY(-1px)}}\nhtml[data-ui-stronger-motion] :is(.zs-quiet-tools,.zs-palette) button:not([role=switch]):not(:disabled):active{transform:translateY(1px) scale(.985)}\nhtml[data-ui-stronger-motion] .zw-panel button[role=switch]:before{transition:transform 220ms cubic-bezier(.18,1.12,.3,1),background-color 160ms ease}\nhtml[data-ui-stronger-motion] .zs-quiet-tools :is(input,textarea,select){transition:border-color 140ms ease,box-shadow 140ms ease}\nhtml[data-ui-stronger-motion] .zs-quiet-tools summary{transition:color 140ms ease}\n@keyframes zs-shade-enter{from{opacity:0}to{opacity:1}}\n@keyframes zs-drawer-enter{from{opacity:.75;transform:translateX(18px)}to{opacity:1;transform:translateX(0)}}\n@keyframes zs-palette-enter{from{opacity:.8;transform:translateY(8px) scale(.99)}to{opacity:1;transform:translateY(0) scale(1)}}\n@keyframes zs-page-enter-enhanced{from{opacity:.82;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}\n@keyframes zs-drawer-exit{to{opacity:0;transform:translateX(12px)}}\n@keyframes zs-palette-exit{to{opacity:0;transform:translateY(5px) scale(.995)}}\nhtml[data-ui-stronger-paused] :is(.zs-surface-backdrop,.zs-tools,.zs-palette,.zs-page-transition){animation-play-state:paused!important}\n@media(prefers-reduced-motion:reduce){html[data-ui-stronger-motion] :is(.zs-surface-backdrop,.zs-surface-backdrop>*,.zs-page-transition){animation:none!important}html[data-ui-stronger-motion] :is(.zs-quiet-tools,.zs-palette) :is(button,input,textarea,select,summary),html[data-ui-stronger-motion] .zw-panel button[role=switch]:before{transition:none!important}html[data-ui-stronger-motion] :is(.zs-quiet-tools,.zs-palette) button{transform:none!important}}\n\n/* Native select semantics, themed browser picker; older engines keep native UI. */\nhtml[data-ui-stronger] :where(.zw-panel,.zs-tools,.zs-palette,.zs-welcome,.zw-controls,.zs-process,.zs-home-modules) select:not([multiple]):not([size]){font:inherit;color:var(--zw-ink);background-color:var(--zw-paper);border:1px solid var(--zw-line);min-width:0;max-width:100%;padding:8px 11px;cursor:pointer;box-sizing:border-box}\nhtml[data-ui-stronger] :where(.zw-panel,.zs-tools,.zs-palette,.zs-welcome,.zw-controls,.zs-process,.zs-home-modules) select:disabled{opacity:.5;cursor:default}\nhtml[data-ui-stronger] :where(.zw-panel,.zs-tools,.zs-palette,.zs-welcome,.zw-controls,.zs-process,.zs-home-modules) select:focus-visible{outline:2px solid var(--zw-purple);outline-offset:2px}\n@supports (appearance:base-select){\n html[data-ui-stronger] :where(.zw-panel,.zs-tools,.zs-palette,.zs-welcome,.zw-controls,.zs-process,.zs-home-modules) select:not([multiple]):not([size]),html[data-ui-stronger] :where(.zw-panel,.zs-tools,.zs-palette,.zs-welcome,.zw-controls,.zs-process,.zs-home-modules) select:not([multiple]):not([size])::picker(select){appearance:base-select}\n html[data-ui-stronger] :where(.zw-panel,.zs-tools,.zs-palette,.zs-welcome,.zw-controls,.zs-process,.zs-home-modules) select:not([multiple]):not([size]){align-items:center;gap:14px;font-size:13px;line-height:1.6}\n html[data-ui-stronger] :where(.zw-panel,.zs-tools,.zs-palette,.zs-welcome,.zw-controls,.zs-process,.zs-home-modules) select:not([multiple]):not([size]):open{border-color:var(--zw-purple)}\n html[data-ui-stronger] :where(.zw-panel,.zs-tools,.zs-palette,.zs-welcome,.zw-controls,.zs-process,.zs-home-modules) select:not([multiple]):not([size])::picker-icon{color:var(--zw-muted);font-size:11px}\n html[data-ui-stronger] :where(.zw-panel,.zs-tools,.zs-palette,.zs-welcome,.zw-controls,.zs-process,.zs-home-modules) select:not([multiple]):not([size])::picker(select){color:var(--zw-ink);background:var(--zw-paper);border:1px solid var(--zw-line);border-radius:10px!important;padding:5px;box-shadow:0 8px 24px #00000014;min-inline-size:200px;box-sizing:border-box;max-block-size:min(340px,55vh);max-inline-size:calc(100vw - 24px);overflow:auto;overscroll-behavior:contain;scrollbar-width:thin;margin-block:5px;font:13px/1.6 var(--hud-mono,ui-monospace,monospace)}\n html[data-ui-stronger] :where(.zw-panel,.zs-tools,.zs-palette,.zs-welcome,.zw-controls,.zs-process,.zs-home-modules) select:not([multiple]):not([size]) option{display:flex;align-items:center;gap:9px;font-size:13px;font-weight:400;min-block-size:34px;padding:7px 10px;border:0;border-radius:5px!important;white-space:normal;overflow-wrap:anywhere;color:var(--zw-ink);background:transparent;cursor:pointer;box-sizing:border-box}\n html[data-ui-stronger] :where(.zw-panel,.zs-tools,.zs-palette,.zs-welcome,.zw-controls,.zs-process,.zs-home-modules) select:not([multiple]):not([size]) option:checked{background:var(--zw-soft);font-weight:500}\n html[data-ui-stronger] :where(.zw-panel,.zs-tools,.zs-palette,.zs-welcome,.zw-controls,.zs-process,.zs-home-modules) select:not([multiple]):not([size]) option:is(:hover,:focus-visible){background:var(--zw-panel);outline:1px solid var(--zw-purple);outline-offset:-1px}\n html[data-ui-stronger] :where(.zw-panel,.zs-tools,.zs-palette,.zs-welcome,.zw-controls,.zs-process,.zs-home-modules) select:not([multiple]):not([size]) option::checkmark{color:var(--zw-deep);font-size:11px}\n html[data-ui-stronger] :where(.zw-panel,.zs-tools,.zs-palette,.zs-welcome,.zw-controls,.zs-process,.zs-home-modules) select:not([multiple]):not([size]) option:disabled{color:var(--zw-muted);opacity:.55;cursor:default}\n html[data-ui-stronger] :where(.zw-panel,.zs-tools,.zs-palette,.zs-welcome,.zw-controls,.zs-process,.zs-home-modules) select:not([multiple]):not([size]) optgroup{padding:4px 0;font-size:11px;font-weight:400;color:var(--zw-muted)}\n html[data-ui-stronger] :where(.zw-panel,.zs-tools,.zs-palette,.zs-welcome,.zw-controls,.zs-process,.zs-home-modules) select:not([multiple]):not([size]) optgroup>legend{padding:7px 10px 4px;font-size:11px;font-weight:400;color:var(--zw-muted)}\n}\n\n/* Typography rhythm: owned controls only; prose stays left aligned. */\nhtml[data-ui-stronger] .zs-quiet-tools :is(.zw-panel,.zs-thinking,.zs-process) button:not([role=switch]):not(.zs-icon-button){display:inline-flex;align-items:center;justify-content:center;min-height:34px;max-width:100%;box-sizing:border-box;text-align:center;line-height:20px;letter-spacing:.015em;white-space:normal;overflow-wrap:anywhere;gap:7px}\nhtml[data-ui-stronger] .zs-quiet-tools :is(.zw-panel,.zs-thinking,.zs-process) button:before,html[data-ui-stronger] .zs-quiet-tools :is(.zw-panel,.zs-thinking,.zs-process) button:after{flex:none;align-self:center}\nhtml[data-ui-stronger] .zs-quiet-tools .zs-page-transition label:not(.zw-row-actions):has(>input:not([type=checkbox]):not([type=radio]),>textarea,>select){display:grid;gap:6px;min-width:0;line-height:1.6;text-align:start;letter-spacing:normal}\nhtml[data-ui-stronger] .zs-quiet-tools .zs-page-transition :is(input:not([type=checkbox]):not([type=radio]):not([type=range]),select){min-height:38px;line-height:20px}\nhtml[data-ui-stronger] .zs-quiet-tools :is(.zw-panel,.zs-thinking,.zs-process) :is(p,li){line-height:1.75;letter-spacing:normal;overflow-wrap:anywhere;text-align:start}\nhtml[data-ui-stronger] .zs-quiet-tools :is(.zw-panel,.zs-thinking,.zs-process) small{font-family:inherit;font-size:11px;line-height:1.65;letter-spacing:.015em;text-transform:none;overflow-wrap:anywhere}\nhtml[data-ui-stronger] .zs-quiet-tools .zw-setting strong{font-size:13px;font-weight:500;line-height:1.55;letter-spacing:normal}\nhtml[data-ui-stronger] .zs-quiet-tools .zw-setting span{line-height:1.65;letter-spacing:normal}\nhtml[data-ui-stronger] .zs-quiet-tools .zw-row-actions{align-items:center;gap:8px 12px}\nhtml[data-ui-stronger] .zs-quiet-tools label:has(>input:is([type=checkbox],[type=radio])){display:flex;align-items:flex-start;gap:8px;min-width:0;white-space:normal;line-height:20px;letter-spacing:normal}\nhtml[data-ui-stronger] .zs-quiet-tools label>input:is([type=checkbox],[type=radio]){flex:none;margin:3px 0 0;width:14px;height:14px}\nhtml[data-ui-stronger] .zs-quiet-tools .zw-row-actions>label:not(:last-child){margin-inline-start:0}\nhtml[data-ui-stronger] .zs-quiet-tools :is(.zw-record-editor,.zw-connect,.zs-bots) form{row-gap:14px}\nhtml[data-ui-stronger] .zs-quiet-tools .zs-section-select{align-items:center}\nhtml[data-ui-stronger] .zs-quiet-tools .zs-section-select select{line-height:20px;min-height:36px;letter-spacing:normal}\nhtml[data-ui-stronger] .zs-quiet-tools .zs-icon-button{line-height:1}\nhtml[data-ui-stronger] .wtg9ga_root :is(.wtg9ga_panelTitle,.wtg9ga_newSessionLabel,.wnFoaW_title){font-size:13px;line-height:20px;letter-spacing:normal}\nhtml[data-ui-stronger] .wtg9ga_root .GAkraW_sectionLabel{font-size:12px;line-height:20px;letter-spacing:.02em}\nhtml[data-ui-stronger] .wtg9ga_root .zs-extension-entry{align-items:center;font-size:13px;line-height:20px}\nhtml[data-ui-stronger] .wtg9ga_root .zs-extension-entry>span{font-size:inherit;line-height:inherit}\n@media(max-width:560px){html[data-ui-stronger] .zs-quiet-tools .zw-row-actions>label{margin-inline-start:0;max-width:100%}html[data-ui-stronger] .zs-quiet-tools .zs-model-toolbar{align-items:flex-start;flex-wrap:wrap}html[data-ui-stronger] .zs-quiet-tools .zs-model-toolbar>div{flex:1 1 210px;min-width:0}}\n";
 const USAGE_CSS=`
 html[data-ui-stronger] [data-zs-deleted]{display:none!important}
 html[data-ui-stronger] :where(.zw-panel,.zs-tools,.zs-palette) select{width:100%;box-sizing:border-box;cursor:pointer}
 html[data-ui-stronger] :where(.zw-panel,.zs-tools,.zs-palette) select::picker-icon{pointer-events:none}
 html[data-ui-stronger] button[aria-label^="选择模型"]{cursor:pointer;pointer-events:auto}
 html[data-ui-stronger] button[aria-label^="选择模型"] :is(span,svg){pointer-events:none}

 html[data-ui-stronger] .wnFoaW_sessionRow .wnFoaW_rowActions button[aria-label="归档会话"] svg,html[data-ui-stronger] .wnFoaW_sessionRow .wnFoaW_rowActions button[aria-label="取消归档"] svg{display:none}
 html[data-ui-stronger] .wnFoaW_sessionRow .wnFoaW_rowActions button[aria-label="归档会话"]:after{content:'归档';font:11px/20px sans-serif}
 html[data-ui-stronger] .wnFoaW_sessionRow .wnFoaW_rowActions button[aria-label="取消归档"]:after{content:'恢复';font:11px/20px sans-serif}
 .zs-wechat-model{padding:0 0 22px;border-bottom:1px solid var(--zw-line);margin-bottom:20px}.zs-wechat-model small{display:block;margin-top:10px;color:var(--zw-muted);font-family:inherit;font-size:11px;line-height:1.65;letter-spacing:normal}
 .zs-archive-seat{flex:none}.zs-archive-filter{display:flex;gap:12px;margin:2px 0 10px;padding:2px 8px}.zs-archive-filter button{font-family:inherit;font-size:12px;line-height:20px;color:var(--zw-muted);background:none;border:0;border-bottom:1px solid transparent;padding:4px 0;cursor:pointer}.zs-archive-filter button[aria-pressed=true]{color:var(--zw-ink);border-bottom-color:var(--zw-purple)}
 html[data-ui-stronger] .wnFoaW_sessionRow .wnFoaW_rowActions:has(button:is([aria-label="归档会话"],[aria-label="取消归档"],[aria-label="Archive session"],[aria-label="Unarchive session"])){display:flex!important;gap:6px;margin-left:5px}
 html[data-ui-stronger] .wnFoaW_sessionRow:not(:hover):not(:focus-within) .wnFoaW_rowActions>button:not(:is([aria-label="归档会话"],[aria-label="取消归档"],[aria-label="Archive session"],[aria-label="Unarchive session"])){display:none}
 html[data-ui-stronger] .wnFoaW_sessionRow .wnFoaW_rowActions button:is([aria-label="归档会话"],[aria-label="取消归档"],[aria-label="Archive session"],[aria-label="Unarchive session"]){display:inline-flex!important;opacity:.8;min-width:28px;min-height:24px;align-items:center;justify-content:center;pointer-events:auto}

 .zs-usage-dashboard{min-width:0}.zs-usage-dashboard small{font:11px/1.65 ui-monospace,monospace!important;letter-spacing:normal!important;text-transform:none!important}.zs-usage-dashboard h2{font-size:20px;letter-spacing:.03em}.zs-usage-dashboard>header{padding-bottom:12px}.zs-usage-dashboard p{font-size:12px;line-height:1.75;letter-spacing:normal}

 .zs-session-tokens{display:block;width:100%;box-sizing:border-box;text-align:end;font:11px/1.6 ui-monospace,monospace;color:var(--zw-muted);padding:3px 2px;overflow-wrap:anywhere}
 .zs-usage-stats{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1px;background:var(--zw-line);border:1px solid var(--zw-line);border-radius:8px;overflow:hidden;margin:20px 0}
 .zs-usage-stats>div{padding:16px;background:var(--zw-paper);min-width:0}.zs-usage-stats small{display:block;color:var(--zw-muted);font-size:11px}.zs-usage-stats strong{display:block;font:500 23px/1.5 ui-monospace,monospace;overflow-wrap:anywhere;letter-spacing:-.035em}
 .zs-model-usage{padding:0;margin:24px 0;list-style:none}.zs-model-usage li{padding:18px 0;border-top:1px solid var(--zw-line)}.zs-usage-heading{display:flex;align-items:center;justify-content:space-between;gap:16px}.zs-usage-heading>div{min-width:0}.zs-usage-heading b{font-weight:500;overflow-wrap:anywhere}.zs-usage-heading small{display:block;color:var(--zw-muted)}.zs-usage-heading>strong{font:12px ui-monospace,monospace;white-space:nowrap;font-weight:500}.zs-usage-track{height:4px;background:var(--zw-panel);margin:12px 0;border-radius:2px;overflow:hidden}.zs-usage-track i{display:block;height:100%;background:var(--zw-purple)}.zs-model-usage li>p{font-size:12px;line-height:1.7;margin:6px 0}.zs-model-usage li>small{color:var(--zw-muted);font-size:11px}
 @media(max-width:420px){.zs-usage-heading{align-items:flex-start;flex-wrap:wrap;gap:8px}.zs-usage-stats>div{padding:12px}.zs-usage-stats strong{font-size:20px}}
`;
 function apply(ctx){
  wireNativeCatalog(ctx);wireModelSettingsProgress(ctx);wireEntryOwnership(ctx);wirePresetEntry(ctx);wireCacheReading(ctx);wireTeamCatalog(ctx);

  const control=(action,payload={},signal)=>callControl(ctx,action,payload,signal);
  const store=createStore(control),navigation=navigationFor(ctx);wireSessionVisibility(ctx,store);wireArchiveView(ctx,store);wireDraftRows(ctx);wireReadingPosition(ctx);wireBrowserEvidence(ctx,store);
  ctx.effect(()=>{let stopped=false;const ready=()=>{if(stopped)return;const s=store.snapshot(),connected=ctx.connection.state?.getSnapshot?.();if((s.loaded&&(!s.preferences.enabled||!s.preferences.startup||s.error))||(s.loaded&&connected==='connected'&&document.querySelector('[contenteditable="true"],textarea[placeholder]'))){stopped=true;window.dispatchEvent(new CustomEvent('dsh-ui-ready'));observer.disconnect();off();disconnect();clearTimeout(timer);}};const observer=new MutationObserver(ready);observer.observe(document.body,{childList:true,subtree:true});const off=store.subscribe(ready),disconnect=ctx.connection.state?.subscribe?.(ready)??(()=>{}),timer=setTimeout(()=>{stopped=true;observer.disconnect();off();disconnect();},20000);ready();return ()=>{stopped=true;observer.disconnect();off();disconnect();clearTimeout(timer);window.dispatchEvent(new CustomEvent('dsh-ui-ready'));};},'ui-stronger: initial load readiness');ctx.effect(()=>()=>navigation.dispose());void store.refresh();
  ctx.effect(()=>{const style=document.createElement('style');style.dataset.plugin='dsh-ui-stronger';style.textContent=USAGE_CSS+CSS+ARCHITECTURE_CSS+CAPABILITY_CSS+EXTRA_CSS+QUIET_CSS+EASE_CSS+FUTURE_CSS+MODEL_ACCESS_CSS+POLISH_CSS+STUDIO_CSS+SWITCHING_CSS+SHELL_CSS+ANGULAR_CSS+TERMINAL_CSS+SURFACE_CSS+TEAM_CSS;style.textContent+=SESSION_FEATURE_CSS+SMOOTH_MOTION_CSS+COMFORT_CSS;document.head.append(style);const focus=()=>{if(!document.hidden)void store.refresh();};const timer=setInterval(focus,3000);window.addEventListener('focus',focus);document.addEventListener('visibilitychange',focus);return ()=>{clearInterval(timer);style.remove();store.dispose();window.removeEventListener('focus',focus);document.removeEventListener('visibilitychange',focus);};},'ui-stronger: reversible host theme');
  const register=(name,component,extra={})=>ctx.effect(()=>ctx.slots.inject(name,()=>{
   const options={name,id:'ui-stronger-'+name.replaceAll('.','-'),order:100,inject:()=>({store,control}),...extra};
   const kind=ctx.slots.spec?.(name)?.kind,entries=ctx.slots.entries?.(name)??ctx.slots.entriesOfSlot(name);
   const sameCell=entries.filter(entry=>kind==='single'||kind==='keyed'&&entry.options.key===options.key||kind==='list'&&entry.options.id===options.id);
   const priority=Math.min(extra.priority??-100,...sameCell.map(entry=>(entry.options.priority??0)-1));
   return ctx.slots.register({...options,priority},component);
  }),'ui-stronger: '+name);
  register('conversation.header.leading',props=>h(TeamWorkspacePortal,{...props,ctx}),{children:{'ui-stronger.team.member.chat':{kind:'single',scope:'session'}}});
  register('ui-stronger.team.member.chat',TeamMemberConversation);
  register('sidebar.workspaces.session.menu.item',p=>h(DeleteSessionItem,{...p,ctx,store}),{id:'ui-stronger-delete-session',order:190});
  register('sidebar.session.row.trailing',p=>h(DeletedRow,{...p,store}),{id:'ui-stronger-deleted-row'});
  register('sidebar.footer.action',ExtensionEntry,{order:90});
  register('sidebar.brand.mark',p=>useState(store).preferences.enabled?h(Mark,p):h(FishLogo,{size:p.size||28}));
  register('conversation.hero.brand.mark',p=>useState(store).preferences.enabled?h(Welcome,{navigation,store}):h(FishLogo,{size:p.size||80}));
  register('shell.overlay',()=>{return h(React.Fragment,null,h(MotionBridge,{store,navigation}),h(DeleteSessionDialog,{store,control}),h(ArchiveVisibility,{ctx,store}),h(SidebarFolderActions,{store,control}),h(LayoutPortal,{store,navigation}),h(Tools,{store,control,navigation}),h(BackgroundLayer,{store}),h(Palette,{store,navigation}),h(Pet,{store,control}));});
  register('conversation.session.header.actions',Header);
  register('conversation.session.header.actions',TeamAccess,{id:'ui-stronger-team-entry',order:85});
  register('conversation.composer.dock',MessageEditing,{order:90});
  register('conversation.hero.options',({sessionId})=>{React.useEffect(()=>{store.session(sessionId);},[sessionId]);return null;});
  register('settings.section',Settings,{label:'界面增强',order:65});
  register('settings.section',props=>h(ConversationImports,{...props,navigation}),{id:'ui-stronger-imports',label:'导入对话',order:67});
  register('settings.section',UsageDashboard,{id:'ui-stronger-token-usage',label:'Token 用量',order:66});
  // Capability management is reached through the extension selector; no duplicate settings section.
 }
 return {name:'dsh-ui-stronger',inject:['slots','connection','layout','uiWorkspace','workspaces'],apply};
}});






