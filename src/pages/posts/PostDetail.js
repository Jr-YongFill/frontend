// PostDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Wrapper from '../../components/Wrapper';
import { baseAPI } from '../../config';
import palette from '../../styles/pallete';
import styled from 'styled-components';

/* data객체 정보 예시
{
    "postId": 1,
    "title": "제목 초안 2",
    "category": "정보게시판",
    "content": "내용 초안2",
    "writerName": "이동규",
    "createTime": "2024-07-26T12:35:01.382685",
    "lastUpdateTime": "2024-07-30T09:12:16.439996",
    "likeCount": 2,
    "viewCount": 4,
    "updateYn": "N",
    "filePath": "default_profile_image.jpg",
    "liked": false
}
*/
const Container = styled.div`
  display: flex;
  flex-direction: column;
  jutify-content: center;
  align-items: center;
`


const PageContainer = styled.div`
  width: 80%;
  margin-top: 40px;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  background: white;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PageHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

const PageHeaderWriter = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  justify-content: center;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #333;
`;

const Meta = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
`;

const Content = styled.p`
  font-size: 16px;
  line-height: 1.6;
  color: #444;
`;

const LoadingMessage = styled.div`
  text-align: center;
  color: #aaa;
  font-size: 18px;
`;

const ProfileImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
`;

const MyBtn = styled.button`
  background-color: ${(props) => props.color};
  border: none;
  width: 60px;
  height: 25px;
  border-radius: 20px;
  font-size: 15px;
  font-weight: bold;
  color: white;
  margin-left: 10px;
`;

const LikeButton = styled.button`
  background-color: ${(props) => props.liked ? palette.skyblue : palette.gray};
  border: none;
  color: white;
  font-size: 10px;
  cursor: pointer;
  width: 50px;
  height: 50px;
  border-radius: 80px;
  margin-top: 20px;
  transition: background-color 0.3s;
`;

const CommentContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 50px;
`;

const HighLight = styled.div`
  background: ${palette.skyblue};
  width: 100%;
  height: 8px;
  margin-top: 3px;
`;


const WriteComment = styled.div`
  display: flex;
  margin-top: 20px;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const CommentInput = styled.input`
  flex-grow: 1;
  padding: 8px 15px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 10px;
`;

const CommentSubmitButton = styled.button`
  padding: 10px 20px;
  background-color: ${palette.skyblue};
  border: none;
  color: white;
  font-size: 14px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: ${palette.darkblue};
  }
`;

const Comment = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 30px;
`;

const CommentHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;


const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0;
`;

const PageButton = styled.button`
  background-color: ${(props) => (props.active ? palette.skyblue : '#ccc')};
  border: none;
  margin: 0 10px;
  padding: 10px 20px;
  border-radius: 10px;
  color: ${(props) => (props.active ? 'white' : '#333')};
  font-size: 18px;
  
  &:hover {
    background-color: ${(props) => (props.active ? '#0080ff' : '#bbb')};
  }

  &:disabled {
    background-color: #eee;
    cursor: not-allowed;
    pointer-events: none;
  }
`;

function PostDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [comments, setComments] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const memberId = localStorage.getItem('id');
  const [commentText, setCommentText] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [editCommentId, setEditCommentId] = useState(null);
  const [editComment, setEditComment] = useState('');

  const handleCommentChange = (event) => {
    setEditComment(event.target.value);
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    if (!commentText.trim()) return;  // 빈 댓글 방지

    try {
      const response = await baseAPI.post(`/api/posts/${id}/comments`, { content: commentText });
      setCommentText('');
    } catch (error) {
      console.error('Failed to post comment:', error);
    }
    fetchComment();
  };

  const handleEditComment = (commentId, content) => {
    setEditCommentId(commentId);
    setEditComment(content);
  };

  const fetchDeletePost = async () => {
    try {
      await baseAPI.delete(`/api/posts/${id}`);
      navigate(`/community/main`);
    } catch (error) {
      alert("작성자만 지울 수 있습니다.");
    }
  }

  const fetchDeleteComment = async (id) => {
    try {
      await baseAPI.delete(`/api/comments/${id}`);
    } catch (error) {
      alert("작성자만 지울 수 있습니다.");
    }
    fetchComment();
  }

  const fetchUpdateComment = async (id) => {
    try {
      await baseAPI.patch(`/api/comments/${id}`, {
        content: editComment
      });
    } catch (error) {
      alert("작성자만 수정할 수 있습니다.");
    }
    setEditComment('');
    setEditCommentId(null);
    fetchComment();
  }

  const fetchLike = async () => {
    if (data.liked) {
      const response = await baseAPI.delete(`/api/posts/${id}/likes`);
      if (response.data.status === 'OK') {
        data.liked = !data.liked;
      }
    } else {
      const response = await baseAPI.post(`/api/posts/${id}/likes`);
      if (response.data.status === 'OK') {
        data.liked = !data.liked;
      }
    }

    fetchData();
  }

  const fetchData = async () => {
    try {
      const response = await baseAPI.get(`/api/posts/${id}`);
      const formattedDate = new Date(response.data.createTime).toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      response.data.createTime = formattedDate;
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComment = async () => {
    const response = await baseAPI.get(`/api/posts/${id}/comments?page=${currentPage}&size=10`);
    setComments(response.data);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await baseAPI.get(`/api/posts/${id}`);
        const formattedDate = new Date(response.data.createTime).toLocaleString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
        response.data.createTime = formattedDate;
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };


    const fetchComment = async () => {
      const response = await baseAPI.get(`/api/posts/${id}/comments?page=${currentPage}&size=10`);
      setComments(response.data);
    }
    fetchData();
    fetchComment();
  }, [id, currentPage]);

  if (isLoading) {
    return <LoadingMessage>로딩중...</LoadingMessage>;
  }

  return (
    <>
      <Header />
      <Container>
        <PageContainer>
          <Title>{data.title}</Title>
          <PageHeader>
            <div style={{ display: 'flex' }}>
              <ProfileImage src={data.filePath} alt="작성자 프로필" />
              <PageHeaderWriter>
                <div>
                  작성자: {data.writerName}
                </div>
                <div>
                  작성알: {data.createTime}
                </div>
              </PageHeaderWriter>
            </div>
            <div style={{ display: 'flex' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginRight: '20px' }}>
                <MyBtn
                  color={palette.skyblue}
                  onClick={() => navigate(`/post/update/${id}`)}>
                  수정
                </MyBtn>
                <div>
                  좋아요: {data.likeCount}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <MyBtn
                  color={palette.skyblue}
                  onClick={() => fetchDeletePost()}>
                  삭제
                </MyBtn>
                <div>
                  조회수: {data.viewCount}
                </div>
              </div>
            </div>
          </PageHeader>
          <Wrapper>
            <Content>{data.content}</Content>
          </Wrapper>

          {memberId && <LikeButton liked={data.liked} onClick={fetchLike}>
            Like
          </LikeButton>}
          <CommentContainer>
            <Title>댓글</Title>
            <HighLight />
            {memberId &&
              <WriteComment>
                <form onSubmit={handleCommentSubmit}>
                  <CommentInput
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="댓글을 입력하세요..."
                  />
                  <CommentSubmitButton type="submit">댓글 작성</CommentSubmitButton>
                </form>
              </WriteComment>
            }
            {
              comments && comments.resultList.map((comment, idx) => {
                return (
                  <Comment key={idx}>
                    <CommentHeader>
                      <div style={{ display: 'flex' }}>
                        <ProfileImage src={comment.filePath} alt="작성자 프로필" />
                        <PageHeaderWriter>
                          <div>
                            작성자: {comment.memberNickname}
                          </div>
                          <div>
                            작성알: {comment.createDate}
                          </div>
                        </PageHeaderWriter>
                      </div>
                      <div style={{ display: 'flex' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginRight: '20px' }}>
                          <MyBtn
                            color={palette.skyblue}
                            onClick={() => handleEditComment(comment.id, comment.content)}>
                            수정
                          </MyBtn>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                          <MyBtn
                            color={palette.skyblue}
                            onClick={() => fetchDeleteComment(comment.id)}>
                            삭제
                          </MyBtn>
                        </div>
                      </div>
                    </CommentHeader>

                    <div style={{ fontSize: '25px' }}>
                      {comment.content}
                    </div>
                    {editCommentId === comment.id && (
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <input
                          value={editComment}
                          onChange={handleCommentChange}
                          style={{ width: '60%', height: '20px', fontSize: '18px', marginBottom: '20px', 'border-radius': '10px' }} />
                        <MyBtn
                          color={palette.skyblue}
                          onClick={() => fetchUpdateComment(comment.id)}>수정</MyBtn>
                      </div>
                    )}
                  </Comment>
                );
              })
            }
            {comments && (
              <PaginationContainer>
                <PageButton
                  onClick={() => {
                    setCurrentPage(currentPage - 1);
                  }}
                  disabled={currentPage === 0}
                >
                  이전
                </PageButton>
                {comments.pageList.map((page) => (
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
                  disabled={currentPage === comments.totalPage - 1}
                >
                  다음
                </PageButton>
              </PaginationContainer>
            )}
          </CommentContainer>
        </PageContainer>
      </Container>
    </>
  );
}

export default PostDetail;