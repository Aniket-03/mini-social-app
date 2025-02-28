import { useState, useEffect, useCallback } from "react";
import PostItem from "../components/Post";
import Spinner from "../common/Loader";
import NewPost from "../components/CreatePost";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { PostModal } from "../common/modal";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { db, auth } from "../firebase";

const HomePage = () => {
  const currentUser = auth?.currentUser?.uid;
  const [postList, setPostList] = useState<PostModal[]>([]);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pageCount, setPageCount] = useState(1);

  

  const getPosts = async (lastVisible: any): Promise<{ posts: PostModal[]; lastVisible: any }> => {
    const DEFAULT_LIMIT = 2;
    try {
      const baseQuery = query(collection(db, "posts"), orderBy("createdAt", "desc"));
      const paginatedQuery = lastVisible ? query(baseQuery, startAfter(lastVisible), limit(DEFAULT_LIMIT)) : query(baseQuery, limit(DEFAULT_LIMIT));
      const snapshot = await getDocs(paginatedQuery);
      return {
        posts: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        lastVisible: snapshot.docs[snapshot.docs.length - 1] || null,
      };
    } catch (error) {
      console.error("Error fetching posts:", error);
      return { posts: [], lastVisible: null };
    }
  };

  const fetchMorePosts = useCallback(
    async (reset = false) => {
      setIsLoading(true);

      try {
        const { posts: freshPosts, lastVisible: newLastDoc } = await getPosts(
          reset ? null : lastDoc
        );

        if (freshPosts.length) {
          setPostList((prevList) =>
            [...prevList, ...freshPosts].filter(
              (item, idx, arr) => idx === arr.findIndex((p) => p.id === item.id)
            )
          );
          setLastDoc(newLastDoc);
        }
      } catch (err) {
        console.error("Failed to retrieve posts:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [lastDoc, pageCount]
  );

  useEffect(() => {
    const scrollObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const lastElement = document.querySelector(".scrollItem:last-child");
          if (lastElement) {
            scrollObserver.unobserve(lastElement);
          }
          setPageCount((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    const lastElement = document.querySelector(".scrollItem:last-child");
    if (lastElement) {
      scrollObserver.observe(lastElement);
    }

    return () => scrollObserver.disconnect();
  }, [postList]);

  useEffect(() => {
    fetchMorePosts();
  }, [pageCount]);

  const refreshPosts = () => {
    fetchMorePosts(true);
  };

  return (
    <>
      {currentUser && <NewPost onPostAdded={refreshPosts} />}

      <div className="flex py-4 px-6">
        {isLoading && <Spinner />}
        <div className="w-full max-w-xl feeds-container">
          {postList.length === 0 && !isLoading && (
            <p className="text-center text-lg text-gray-200">No posts available.</p>
          )}
          <div className="scrollContainer">
            {postList.map((item) => (
              <div
                key={item.id}
                className="p-4 mb-2 rounded-lg transition-all duration-300 scrollItem"
              >
                <PostItem
                  post={item}
                  currentUserId={currentUser}
                  setLoading={setIsLoading}
                  updatePost={() => {}}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
