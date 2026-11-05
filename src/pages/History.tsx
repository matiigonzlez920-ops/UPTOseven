import React, { useEffect, useMemo } from 'react';
import { PageId } from '../types';
// @ts-ignore Vite loads the complete standalone document as a string.
import historyDocument from '../../historia-7up-con-afiches.html?raw';
interface HistoryProps { onNavigate: (page: PageId) => void; }
export const History: React.FC<HistoryProps> = () => {
  useEffect(() => { const previous = document.body.style.overflow; document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = previous; }; }, []);
  const content = useMemo(() => historyDocument.replace('</head>', '<style>header{display:none!important}</style></head>'), []);
  return <div style={{position:'fixed',top:80,left:0,right:0,bottom:0,zIndex:40,background:'#034b32'}}><iframe title="La Época — Historia de 7UP" srcDoc={content} style={{width:'100%',height:'100%',border:0,display:'block'}} /></div>;
};
