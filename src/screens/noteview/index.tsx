import React, { useEffect, useState } from 'react';
import PageWithHeader from '../../components/layout/page-with-header';

import { Text, View } from 'react-native';
import PDFViewer from '../../components/common/pdf-viewer';

function NoteViewScreen() {
  const [driveUrl, setDriveUrl] = useState(
    'https://drive.google.com/file/d/12ZETi4ovmVR6QptVDQkmP7GCPo4nkhED/view?usp=sharing',
  );
  const [pdfSource, setPdfSource] = useState(null);
  const convertGoogleDriveLink = (shareLink: string) => {
    // Extract file ID from Google Drive sharing link
    const match = shareLink.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1]) {
      const fileId = match[1];
      return `https://drive.google.com/uc?export=download&id=${fileId}`;
    }
    return shareLink; // Return original if not a Google Drive link
  };

  const validateDriveLink = async (url: string): Promise<string | null> => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('pdf')) {
        return url; // valid
      }
      console.warn('Not a direct PDF, got:', contentType);
      return null;
    } catch (err) {
      console.error('Drive validation failed', err);
      return null;
    }
  };

  useEffect(() => {
    (async () => {
      if (!driveUrl) return;
      const validUrl = await validateDriveLink(
        convertGoogleDriveLink(driveUrl),
      );
      if (validUrl) {
        setPdfSource({ uri: validUrl, cache: true });
      } else {
        console.log(
          'This Google Drive file isn’t a direct PDF. Please download and re-upload.',
        );
      }
    })();
  }, [driveUrl]);
  console.log(pdfSource, '---pdfSource');
  return (
    <PageWithHeader>
      <View style={{ flex: 1 }}>
        <PDFViewer
          source={{
            uri: convertGoogleDriveLink(
              'https://drive.google.com/file/d/12ZETi4ovmVR6QptVDQkmP7GCPo4nkhED/view?usp=sharing',
            ),
            cache: true,
          }}
          enablePaging={false}
          onLoadComplete={() => console.log('loading completed')}
          page={10}
          enableRTL={false}
        />
      </View>
    </PageWithHeader>
  );
}

export default NoteViewScreen;
