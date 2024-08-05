import React from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';
import CustomButton from '../CustomButton';
import ReactModal from 'react-modal';

const MyGlassModal = styled(Modal)`
  position: absolute;
  top: 50%;
  left: 50%;
  right: auto;
  bottom: auto;
  transform: translate(-50%, -50%);
  width: 400px;
  padding: 20px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #000;

`;

const GlassModal = ({ isModalOpen, setIsModalOpen, onClick, message }) => {
  const afterModalOpen = ()=>{
    ReactModal.defaultStyles.overlay.backgroundColor = 'rgba(255,255,255,0.1)';
    ReactModal.defaultStyles.content.display = 'flex';
  }

  return (
    <>
      <MyGlassModal
        isOpen={isModalOpen}
        onRequestClose={setIsModalOpen}
        ariaHideApp={false}
        onAfterOpen={afterModalOpen}
      >
        <p>{message}</p>
        <CustomButton onClick={onClick}>확인</CustomButton>
      </MyGlassModal>
    </>
  );
};

export default GlassModal;
