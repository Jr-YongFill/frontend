import styled from "styled-components";
import palette from '../styles/pallete';


const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0;
`;

const PageButton = styled.button`
  background-color: ${(props) => (props.active ? palette.purple : palette.dark)};
  border: none;
  margin: 0 10px;
  padding: 10px 20px;
  border-radius: 10px;
  color: white;
  font-size: 18px;
  
  &:hover {
    background-color: ${palette.purple};
  }

  &:disabled {
    background: transparent;
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    color: ${palette.gray};
    cursor: not-allowed;
    pointer-events: none;
  }
`;

const PageButtonController = ({ data, setCurrentPage, currentPage }) => {
    return (
        <>
            {data &&
                <PaginationContainer>
                    <PageButton
                        onClick={() => {
                            setCurrentPage(currentPage - 1);
                        }}
                        disabled={currentPage === 0}
                    >
                        이전
                    </PageButton>
                    {data.pageList.map((page) => (
                        <PageButton
                            key={page}
                            onClick={() => {
                                setCurrentPage(page - 1);
                            }}
                            active={currentPage === page - 1}
                        >
                            {page}
                        </PageButton>
                    ))}
                    <PageButton
                        onClick={() => {
                            setCurrentPage(currentPage + 1);
                        }}
                        disabled={currentPage === data.totalPage - 1}
                    >
                        다음
                    </PageButton>
                </PaginationContainer>
            }
        </>);
}


export default PageButtonController;