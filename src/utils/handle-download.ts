import RNFS from 'react-native-fs';
import { Toast } from 'toastify-react-native';

import { addOfflineFile } from '../store/slices/offline-slice';

const handleDownload = async (item: any, activeTab: string, dispatch: any) => {
  try {
    const { fileUrl, title, id } = item;
    if (!fileUrl) {
      Toast.error('No file URL available');
      return;
    }

    // Convert Google Drive link to direct download
    let downloadUrl = fileUrl;
    if (fileUrl.includes('drive.google.com')) {
      const fileIdMatch = fileUrl.match(/[-\w]{25,}/);
      const fileId = fileIdMatch ? fileIdMatch[0] : null;
      if (!fileId) {
        Toast.error('Invalid Drive link');
        return;
      }
      downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    }

    // Create local save path
    const fileName = `${title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
    const localPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

    Toast.success('Download started...');

    const download = RNFS.downloadFile({
      fromUrl: downloadUrl,
      toFile: localPath,
      background: true,
      progress: res => {
        const progressPercent = Math.round(
          (res.bytesWritten / res.contentLength) * 100,
        );
        console.log(`Downloading ${title}: ${progressPercent}%`);
      },
    });

    const result = await download.promise;

    if (result.statusCode === 200) {
      Toast.success(`Downloaded "${title}" successfully!`);
      console.log('Saved to:', localPath);

      // ✅ Dispatch Redux action
      dispatch(
        addOfflineFile({
          id,
          title,
          localPath,
          type: activeTab,
        }),
      );
    } else {
      throw new Error('Download failed');
    }
  } catch (err: any) {
    console.error('Download error:', err);
    Toast.error('Failed to download file');
  }
};

export default handleDownload;
