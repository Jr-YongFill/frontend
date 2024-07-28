import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import styled from 'styled-components';
import palette from '../styles/pallete';


const Wrapper = styled.div`
  display: flex;
  margin: 10px;
  background: gold;
  justify-content:center;
  align-content:center;  
`;


const ContainerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: blue;
  justify-content:center;
  align-content:center;  
`;

const ContainerRow = styled.div`
  display:flex;
  background:orange;
  justify-content:space-between;
`

const Container = styled.div`
  background:white;
  width:35vw;
  margin: 5px 0px 0px 5px;
  height: 38vh;
`
const HighLight = styled.div`
  background:${palette.skyblue};
  width:150px;
  height: 8px;
  margin-top:-20px;

`

const PostList = ({ posts }) => (
  <ul>
    {posts.map((post, index) => (
      <li key={index}>
        <h4>{post.title}</h4>
        <p>작성자: {post.writerName}</p>
        <p>작성 시간: {new Date(post.createTime).toLocaleString()}</p>
        <p>마지막 수정 시간: {new Date(post.lastUpdateTime).toLocaleString()}</p>
      </li>
    ))}
  </ul>
);


const Community = () => {
  const navigate = useNavigate(); // useNavigate를 호출
  const [data, setData] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/categories/posts');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };


    fetchData();
  }, []);


  
  return (
    <div>
      <Header />
      <Wrapper>
        <ContainerWrapper>
          <ContainerRow>
            <Container>

              <h2>오늘의 면접</h2>
              <HighLight/>

            </Container>
            <Container>

              <h2>CS 투표</h2>
              <HighLight/>

            </Container>
          </ContainerRow>
          <ContainerRow>
            <Container>

              <h2>정보게시판</h2>
              
              <HighLight/>

            </Container>
            <Container>

              <h2>질문게시판</h2>
              <HighLight/>

            </Container>
          </ContainerRow>

        </ContainerWrapper>
        

      </Wrapper>


    </div>
  );
};

export default Community;
