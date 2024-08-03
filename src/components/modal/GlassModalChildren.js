import React, { useState } from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';

const MyGlassModal = styled(Modal)`
  position: absolute;
  top: 50%;
  left: 50%;
  right: auto;
  bottom: auto;
  transform: translate(-50%, -50%);
  width: ${(props) => props.width || '500px'};
  padding: 20px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #000;
`;

const GlassModalChildren = ({ isModalOpen, setIsModalOpen, onClick, children, width }) => {

    return (
        <>
            <MyGlassModal
                isOpen={isModalOpen}
                onRequestClose={setIsModalOpen}
                ariaHideApp={false}
                width={width}
            >
                {children}
            </MyGlassModal>
        </>
    );
};

export default GlassModalChildren;
