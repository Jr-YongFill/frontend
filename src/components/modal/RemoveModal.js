import Modal from 'react-modal';
import palette from '../../styles/pallete';
import styled from 'styled-components';



const MyBtn = styled.button`
  background-color: ${(props) => props.color};
  border: none;
  width: 300px;
  height: 100px;
  border-radius: 20px;
  font-size: 30px;
  font-weight: bold;
  color: white;
  margin-top: 30px;
`;

export const RemoveModal = ({ isModalOpen, setIsModalOpen, onClick }) => {
    return (
        <Modal
            isOpen={isModalOpen}
            onRequestClose={setIsModalOpen}
            style={{
                content: {
                    top: '250px',
                    left: '600px',
                    right: '600px',
                    bottom: '250px',
                    borderRadius: '30px',
                    border: 'none',
                    background: `${palette.pink}`,
                }
            }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ fontSize: '30px', color: 'red' }}>
                    정말로 지우겠습니까?
                </div>
                <MyBtn color={palette.skyblue}
                    onClick={onClick}>
                    삭제
                </MyBtn>
            </div>
        </Modal>
    );
}