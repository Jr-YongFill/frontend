// PostDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import { baseAPI } from '../../config';
import palette from '../../styles/pallete';
import styled from 'styled-components';
import EditorViewer from '../../components/posts/EditorViewer';
import CustomButton from '../../components/CustomButton';
import { localStorageGetValue } from '../../utils/CryptoUtils';
import { RemoveModal } from '../../components/modal/RemoveModal';
import Wrapper from "../../components/Wrapper";
import GlassCard from "../../components/GlassCard";
import PageButtonController from '../../components/PageButtonController';
import Block from '../../components/Block';

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
  background-color: ${(props) => props.liked ? palette.purple : palette.dark};
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
  background: rgb(255,255,255,0.6);
  width: 100%;
  height: 1px;
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

function PostDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [comments, setComments] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const memberId = localStorageGetValue('member-id');
  const memberRole = localStorageGetValue('member-role');
  const [commentText, setCommentText] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [editCommentId, setEditCommentId] = useState(null);
  const [editComment, setEditComment] = useState('');
  const [isDeleteCommentModalOpen, setIsDeleteCommentModalOpen] = useState(false);
  const [deleteCommentId, setDeleteCommentId] = useState(0);
  const [isDeletePostModalOpen, setIsDeletePostModalOpen] = useState(false);

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

  const handleUpdate = () => {
    navigate("/post/update", { state: { data } });
  }

  const fetchDeletePost = async () => {
    try {
      await baseAPI.delete(`/api/posts/${id}`);
      navigate(`/community/main`);
    } catch (error) {
      alert("작성자만 지울 수 있습니다.");
    }
  }

  const fetchDeleteComment = async () => {
    try {
      await baseAPI.delete(`/api/comments/${deleteCommentId}`);
    } catch (error) {
      alert("작성자만 지울 수 있습니다.");
    }
    setDeleteCommentId(0);
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
      navigate('/community/main');
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
        alert("삭제된 게시글");
        window.location.href = '/community/main';
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
      <Wrapper>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          width: '60vw',
          alignItems: 'center'
        }}>
          <Block />
          <Container>
            {data &&
              <GlassCard>
                <div style={{ padding: '0px 30px 20px' }}>
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
                        {memberId === String(data.memberId) && <CustomButton

                          onClick={handleUpdate}>
                          수정
                        </CustomButton>}
                        <div style={{ visibility: 'hidden' }}>
                          ㅇㅇㅇ
                        </div>

                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        {(memberId === String(data.memberId) || memberRole === 'ADMIN') && <CustomButton

                          onClick={() => setIsDeletePostModalOpen(true)}>
                          삭제
                        </CustomButton>}
                        <div>
                          조회수: {data.viewCount}
                        </div>
                      </div>
                    </div>
                  </PageHeader>
                  <EditorViewer contents={data.content}></EditorViewer>
                  <div style={{
                    margin: 'auto 0', display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}>
                    {memberId && <LikeButton liked={data.liked} onClick={fetchLike}>
                      Like
                    </LikeButton>}
                    <div>
                      {data.likeCount}
                    </div>
                  </div>
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
                                  {memberId === String(comment.memberId) && <CustomButton
                                    onClick={() => handleEditComment(comment.id, comment.content)}>
                                    수정
                                  </CustomButton>}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                  {(memberId === String(comment.memberId) || memberRole === 'ADMIN') &&
                                    <CustomButton
                                      onClick={() => {
                                        setDeleteCommentId(comment.id);
                                        setIsDeleteCommentModalOpen(true);
                                      }}>
                                      삭제
                                    </CustomButton>}
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
                                  color={palette.dark}
                                  onClick={() => fetchUpdateComment(comment.id)}>수정</MyBtn>
                              </div>
                            )}
                          </Comment>
                        );
                      })
                    }
                    <PageButtonController
                      data={comments}
                      setCurrentPage={setCurrentPage}
                      currentPage={currentPage}
                    />
                  </CommentContainer>
                </div>
              </GlassCard>}
          </Container>
          <RemoveModal
            isModalOpen={isDeleteCommentModalOpen}
            setIsModalOpen={() => setIsDeleteCommentModalOpen(false)}
            onClick={() => {
              fetchDeleteComment();
              setIsDeleteCommentModalOpen(false);
            }} />
          <RemoveModal
            isModalOpen={isDeletePostModalOpen}
            setIsModalOpen={() => setIsDeletePostModalOpen(false)}
            onClick={() => {
              fetchDeletePost();
              setIsDeletePostModalOpen(false);
            }} />
        </div>
      </Wrapper >
    </>
  );
}

export default PostDetail;