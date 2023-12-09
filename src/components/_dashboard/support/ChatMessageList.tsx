import { useEffect, useRef } from 'react';
// @types
//
import Scrollbar from '../../Scrollbar';
import ChatMessageItem from './ChatMessageItem';

// ----------------------------------------------------------------------

export default function ChatMessageList({ conversation }: { conversation: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  // const [openLightbox, setOpenLightbox] = useState(false);
  // const [selectedImage, setSelectedImage] = useState<number>(0);

  useEffect(() => {
    const scrollMessagesToBottom = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    };
    scrollMessagesToBottom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation]);

  // const handleOpenLightbox = (url: string) => {
  //   const selectedImage = findIndex(images, (index) => index === url);
  //   setOpenLightbox(true);
  //   setSelectedImage(selectedImage);
  // };

  return (
    <Scrollbar scrollableNodeProps={{ ref: scrollRef }} sx={{ p: 3 }}>
      {conversation.map((message, index) => (
        <ChatMessageItem
          key={index}
          message={message}
          // onOpenLightbox={handleOpenLightbox}
        />
      ))}

      {/* <LightboxModal
        images={images}
        photoIndex={selectedImage}
        setPhotoIndex={setSelectedImage}
        isOpen={openLightbox}
        onClose={() => setOpenLightbox(false)}
      /> */}
    </Scrollbar>
  );
}
