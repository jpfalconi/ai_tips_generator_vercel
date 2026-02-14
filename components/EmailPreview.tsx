import React, { useMemo } from 'react';
import { ContentData } from '../types';
import { generateEmailHTML } from '../services/emailGenerator';

interface EmailPreviewProps {
  data: ContentData;
}

const EmailPreview: React.FC<EmailPreviewProps> = ({ data }) => {
  const htmlContent = useMemo(() => generateEmailHTML(data), [data]);

  return (
    <div className="w-full h-full bg-gray-100 p-8 flex justify-center items-start overflow-auto">
      <div className="bg-white shadow-2xl mx-auto w-[650px] min-h-[800px] border border-gray-300">
        <div className="bg-gray-800 text-white text-xs px-2 py-1 flex justify-between items-center">
            <span>Visualização Outlook Desktop</span>
            <span>600px width</span>
        </div>
        <iframe
            srcDoc={htmlContent}
            title="Email Preview"
            className="w-full h-[800px] border-none"
            style={{ display: 'block' }}
        />
      </div>
    </div>
  );
};

export default EmailPreview;