import { useState, useCallback } from 'react';
import RNFS from 'react-native-fs';
import { Toast } from 'toastify-react-native';
import { useDispatch } from 'react-redux';
import { addOfflineFile } from '../store/slices/offline-slice';

type DownloadStatus = 'idle' | 'downloading' | 'success' | 'error' | 'exists';

interface UseFileDownloaderReturn {
  downloadFile: (item: any, activeTab: string) => Promise<void>;
  progress: number;
  status: DownloadStatus;
  error: string | null;
}

export const useFileDownloader = (): UseFileDownloaderReturn => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<DownloadStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  const downloadFile = useCallback(
    async (item: any, activeTab: string) => {
      try {
        const { fileUrl, title, id } = item;
        if (!fileUrl) {
          Toast.error('No file URL available');
          setStatus('error');
          return;
        }

        setStatus('idle');
        setProgress(0);
        setError(null);

        // Convert Google Drive link to direct download
        let downloadUrl = fileUrl;
        if (fileUrl.includes('drive.google.com')) {
          const fileIdMatch = fileUrl.match(/[-\w]{25,}/);
          const fileId = fileIdMatch ? fileIdMatch[0] : null;
          if (!fileId) {
            Toast.error('Invalid Drive link');
            setStatus('error');
            return;
          }
          downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
        }

        const fileName = `${title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
        const localPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

        // ✅ Check if already downloaded
        const exists = await RNFS.exists(localPath);
        if (exists) {
          Toast.info(`"${title}" is already downloaded`);
          setStatus('exists');

          // Optionally update Redux store if not yet added
          dispatch(
            addOfflineFile({
              id,
              title,
              localPath,
              type: activeTab,
            }),
          );

          return;
        }

        // Start fresh download

        setStatus('downloading');

        const download = RNFS.downloadFile({
          fromUrl: downloadUrl,
          toFile: localPath,
          background: true,
          progressDivider: 1,
          progress: res => {
            const percent = Math.round(
              (res.bytesWritten / res.contentLength) * 100,
            );
            setProgress(percent);
          },
        });

        const result = await download.promise;

        if (result.statusCode === 200) {
          Toast.success(`Downloaded "${title}" successfully!`);
          setStatus('success');

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
        setStatus('error');
        setError(err.message || 'Download failed');
      }
    },
    [dispatch],
  );

  return { downloadFile, progress, status, error };
};
