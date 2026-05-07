const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/export-B3eLk817.js","assets/vendor-CZ6jBF77.js"])))=>i.map(i=>d[i]);
import{g as F,j as n}from"./vendor-CZ6jBF77.js";import{c as x,_,F as k}from"./index-FuDIbL7o.js";import{r as j}from"./export-B3eLk817.js";/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A=x("Download",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"7 10 12 15 17 10",key:"2ggqvy"}],["line",{x1:"12",x2:"12",y1:"15",y2:"3",key:"1vk2je"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E=x("PackageCheck",[["path",{d:"m16 16 2 2 4-4",key:"gfu2re"}],["path",{d:"M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14",key:"e7tb2h"}],["path",{d:"m7.5 4.27 9 5.15",key:"1c824w"}],["polyline",{points:"3.29 7 12 12 20.71 7",key:"ousv84"}],["line",{x1:"12",x2:"12",y1:"22",y2:"12",key:"a4e8g8"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N=x("Printer",[["path",{d:"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",key:"143wyd"}],["path",{d:"M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6",key:"1itne7"}],["rect",{x:"6",y:"14",width:"12",height:"8",rx:"1",key:"1ue0tg"}]]);var O=j();const R=F(O),g=["abstract","introduction","methods","results","discussion","conclusion"];function v(e){const a=g.map(t=>`## ${y(t)}

${e.sections[t].trim()}`).join(`

`);return`# ${e.title}

${e.subtitle}

${e.authors}

${a}

## References

\`\`\`bibtex
${e.bibtex.trim()}
\`\`\`
`}function $(e){const a=g.map(t=>`\\section{${f(y(t))}}
${f(e.sections[t].trim())}`).join(`

`);return`\\documentclass[11pt]{article}
\\usepackage[margin=1in]{geometry}
\\usepackage[T1]{fontenc}
\\usepackage{lmodern}
\\usepackage{hyperref}
\\title{${f(e.title)}}
\\author{${f(e.authors)}}
\\date{\\today}

\\begin{document}
\\maketitle

${a}

\\bibliographystyle{plain}
\\bibliography{references}
\\end{document}
`}async function C(e,a){const t=new R;return t.file("paper.md",v(e)),t.file("paper.tex",$(e)),t.file("references.bib",e.bibtex),t.file("figure.mmd",e.figureMermaid),t.file("literature-cache.json",JSON.stringify(a,null,2)),t.file("submission-checklist.json",JSON.stringify({unicodeNormalized:!0,hasReferences:e.bibtex.includes("@"),hasOrcid:e.orcid.length>0,generatedAt:new Date().toISOString()},null,2)),t.generateAsync({type:"blob"})}async function L(e){const{PDFDocument:a,StandardFonts:t,rgb:i}=await _(async()=>{const{PDFDocument:o,StandardFonts:u,rgb:p}=await import("./export-B3eLk817.js").then(D=>D.i);return{PDFDocument:o,StandardFonts:u,rgb:p}},__vite__mapDeps([0,1])),s=await a.create(),d=await s.embedFont(t.Helvetica),h=await s.embedFont(t.HelveticaBold);let r=s.addPage([612,792]),l=742;function c(o,u=10,p=!1){l<60&&(r=s.addPage([612,792]),l=742),r.drawText(o.slice(0,95),{x:54,y:l,size:u,font:p?h:d,color:i(.09,.13,.11)}),l-=u+7}c(e.title,16,!0),c(e.authors,11),l-=8,g.forEach(o=>{c(y(o),12,!0),w(e.sections[o],92).forEach(u=>c(u,10)),l-=6}),c("References",12,!0),w(e.bibtex.replace(/\s+/g," "),92).forEach(o=>c(o,9));const b=await s.save(),P=b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength);return new Blob([P],{type:"application/pdf"})}function m(e,a){const t=URL.createObjectURL(e),i=document.createElement("a");i.href=t,i.download=a,i.click(),URL.revokeObjectURL(t)}function y(e){return e.charAt(0).toUpperCase()+e.slice(1)}function f(e){return e.replaceAll("\\","\\textbackslash{}").replaceAll("_","\\_").replaceAll("&","\\&").replaceAll("%","\\%")}function w(e,a){const t=e.split(/\s+/g),i=[];let s="";return t.forEach(d=>{`${s} ${d}`.trim().length>a?(i.push(s.trim()),s=d):s=`${s} ${d}`.trim()}),s&&i.push(s),i}function T({project:e,papers:a,notify:t}){function i(r,l,c){m(new Blob([r],{type:c}),l),t(`${l} downloaded`)}async function s(){m(await C(e,a),"numen-submission.zip"),t("Submission bundle downloaded")}async function d(){m(await L(e),"numen-draft.pdf"),t("PDF draft downloaded")}const h=[{label:"Title",pass:e.title.trim().length>0},{label:"Abstract",pass:e.sections.abstract.trim().length>80},{label:"References",pass:e.bibtex.includes("@")},{label:"ORCID",pass:e.orcid.trim().length>0},{label:"Figure",pass:e.figureMermaid.trim().length>0}];return n.jsxs("section",{className:"panel-grid two-columns",children:[n.jsxs("div",{className:"surface",children:[n.jsxs("div",{className:"section-heading",children:[n.jsx("h2",{children:"Artifacts"}),n.jsx(E,{size:18,"aria-hidden":"true"})]}),n.jsxs("div",{className:"export-actions",children:[n.jsxs("button",{type:"button",onClick:()=>i(v(e),"paper.md","text/markdown"),children:[n.jsx(k,{size:17,"aria-hidden":"true"}),"Markdown"]}),n.jsxs("button",{type:"button",onClick:()=>i($(e),"paper.tex","text/plain"),children:[n.jsx(k,{size:17,"aria-hidden":"true"}),"LaTeX"]}),n.jsxs("button",{type:"button",onClick:d,children:[n.jsx(N,{size:17,"aria-hidden":"true"}),"PDF Draft"]}),n.jsxs("button",{type:"button",onClick:s,children:[n.jsx(A,{size:17,"aria-hidden":"true"}),"Bundle"]})]})]}),n.jsxs("div",{className:"surface",children:[n.jsxs("div",{className:"section-heading",children:[n.jsx("h2",{children:"Submission Gate"}),n.jsxs("span",{children:[h.filter(r=>r.pass).length,"/",h.length]})]}),n.jsx("div",{className:"check-list",children:h.map(r=>n.jsxs("div",{className:r.pass?"check pass":"check",children:[n.jsx("span",{children:r.pass?"ready":"todo"}),n.jsx("strong",{children:r.label})]},r.label))})]})]})}export{T as ExportPanel};
