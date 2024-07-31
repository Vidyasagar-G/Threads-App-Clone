import { Flex, Image, Input, InputGroup, InputRightElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Spinner, useDisclosure } from '@chakra-ui/react'
import { IoSendSharp } from 'react-icons/io5'
import useShowToast from '../hooks/useShowToast';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { conversationsAtom, selectedConversationAtom } from '../atoms/messagesAtom';
import { useRef, useState } from 'react';
import { BsFillImageFill } from 'react-icons/bs';
import usePreviewImg from '../hooks/usePreviewImg';

const MessageInput = ({ setMessages }) => {
  const [messageText, setMessageText] = useState("");
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const setConversations = useSetRecoilState(conversationsAtom);
  const showToast = useShowToast();
  const imageRef = useRef(null);
  const { onClose } = useDisclosure();
  const {handleImageChange, imgURL, setImgURL} = usePreviewImg();
  const [isSending, setIsSending] = useState(false);


  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText && !imgURL) return;
    if(isSending) return;

    setIsSending(true);
    try {
      const res = await fetch(`/api/messages/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: messageText,
          recipientId: selectedConversation.userId,
          img:imgURL
        }),
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      setMessages((messages) => [...messages, data]);
      setConversations(prevConvs => {
        const updatedConversations = prevConvs.map(conv => {
          if (conv._id === selectedConversation._id) {
            return {
              ...conv,
              lastMessage: {
                text: messageText,
                sender: data.sender
              }
            }
          }
          return conv;
        });
        return updatedConversations;
      })
      setMessageText("");
      setImgURL("");
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <Flex gap={2} alignItems={"center"}>
      <form onSubmit={handleSendMessage} style={{ flex: 95 }}>
        <InputGroup>
          <Input
            w={"full"}
            placeholder='Type a message...'
            onChange={(e) => setMessageText(e.target.value)}
            value={messageText}
          />
          <InputRightElement onClick={handleSendMessage} cursor={"pointer"}>
            <IoSendSharp cursor={"pointer"} />
          </InputRightElement>
        </InputGroup>
      </form>
      <Flex flex={5} cursor={"pointer"}>
        <BsFillImageFill size={20} onClick={() => imageRef.current.click()} />
        <Input type='file' hidden ref={imageRef} onChange={handleImageChange} />
      </Flex>
      <Modal
        isOpen={imgURL}
        onClose={() => { onClose(); setImgURL("") }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex mt={5} w={"full"}>
              <Image src={imgURL} />
            </Flex>
            <Flex justifyContent={"flex-end"} my={2}>
              {!isSending? <IoSendSharp size={24} cursor={"pointer"}
                onClick={handleSendMessage}/> :
                <Spinner size={"md"}/>
              }
            </Flex>
          </ModalBody>
        </ModalContent>

      </Modal>
    </Flex>
  )
}

export default MessageInput
