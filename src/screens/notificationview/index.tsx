import React, { useEffect, useState } from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import PageWithHeader from '../../components/layout/page-with-header';
import PDFViewer from '../../components/common/pdf-viewer';
import { COLORS } from '../../theme/colors';

type ContentType = 'image' | 'pdf' | 'unknown';

interface ContentState {
  type: ContentType;
  uri: string | null;
  error: string | null;
}

function NotificationViewScreen({ navigation, route }: any) {
  const { url, headerTitle, from, title, description } = route.params ?? {};
  const [content, setContent] = useState<ContentState>({
    type: 'unknown',
    uri: null,
    error: null,
  });
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  console.log('NotificationViewScreen URL:', url);

  // Convert Google Drive link to direct download
  const convertGoogleDriveLink = (shareLink: string) => {
    const match = shareLink.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1]) {
      const fileId = match[1];
      return `https://drive.google.com/uc?export=download&id=${fileId}`;
    }
    return shareLink;
  };

  // Detect content type from URL or headers
  const detectContentType = async (checkUrl: string): Promise<ContentState> => {
    try {
      // First check file extension
      const urlLower = checkUrl.toLowerCase();
      const imageExtensions = [
        '.jpg',
        '.jpeg',
        '.png',
        '.gif',
        '.webp',
        '.bmp',
      ];
      const pdfExtensions = ['.pdf'];

      const hasImageExt = imageExtensions.some(ext => urlLower.includes(ext));
      const hasPdfExt = pdfExtensions.some(ext => urlLower.includes(ext));

      if (hasImageExt) {
        return { type: 'image', uri: checkUrl, error: null };
      }

      if (hasPdfExt) {
        return { type: 'pdf', uri: checkUrl, error: null };
      }

      // If no extension match, check content-type header
      const response = await fetch(checkUrl, { method: 'HEAD' });
      const contentType = response.headers.get('content-type');

      if (contentType?.includes('image')) {
        return { type: 'image', uri: checkUrl, error: null };
      }

      if (contentType?.includes('pdf')) {
        return { type: 'pdf', uri: checkUrl, error: null };
      }

      return {
        type: 'unknown',
        uri: null,
        error: 'Unsupported content type. Only images and PDFs are supported.',
      };
    } catch (err) {
      console.error('Content type detection failed', err);
      return {
        type: 'unknown',
        uri: null,
        error: 'Failed to load content. Please check your connection.',
      };
    }
  };

  useEffect(() => {
    if (!url) {
      setContent({
        type: 'unknown',
        uri: null,
        error: 'No URL provided',
      });
      setLoading(false);
      return;
    }

    (async () => {
      setLoading(true);

      let finalUrl = url;
      // If it's a Google Drive link, convert
      if (url.includes('drive.google.com')) {
        finalUrl = convertGoogleDriveLink(url);
      }

      const result = await detectContentType(finalUrl);
      setContent(result);
      setLoading(false);
    })();
  }, [url]);

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading content...</Text>
        </View>
      );
    }

    if (content.error) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{content.error}</Text>
        </View>
      );
    }

    if (content.type === 'image' && content.uri) {
      return (
        <ScrollView
          contentContainerStyle={styles.imageContainer}
          maximumZoomScale={3}
          minimumZoomScale={1}
        >
          <Image
            source={{ uri: content.uri }}
            style={[styles.image]}
            resizeMode="contain"
            onLoad={() => setImageLoaded(true)}
            onError={() =>
              setContent({
                ...content,
                error: 'Failed to load image',
              })
            }
          />
        </ScrollView>
      );
    }

    if (content.type === 'pdf' && content.uri) {
      return (
        <PDFViewer
          source={{ uri: content.uri, cache: true }}
          enablePaging={false}
          enableRTL={false}
          onLoadComplete={() => console.log('PDF loaded')}
        />
      );
    }

    return null;
  };

  return (
    <PageWithHeader
      headerTitle={headerTitle || 'Notification Viewer'}
      from={from}
    >
      <View style={styles.container}>
        {/* Title Section */}
        {title && (
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
            {description && (
              <Text style={styles.description}>{description}</Text>
            )}
            <View style={styles.divider} />
          </View>
        )}

        {/* Content Section */}
        <View style={styles.contentWrapper}>{renderContent()}</View>
      </View>
    </PageWithHeader>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  titleContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginTop: 12,
  },
  contentWrapper: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#E74C3C',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  imageContainer: {
    backgroundColor: COLORS.surface.background,
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  image: {
    width: Dimensions.get('window').width - 32,
    height: Dimensions.get('window').height - 200,
  },
  zoomHint: {
    marginTop: 16,
    fontSize: 14,
    color: '#007AFF',
    textAlign: 'center',
  },
});

export default NotificationViewScreen;
