import Header from "../components/header";
import LoadingSpinner from "../components/loadingSpinner";
import UserCard from "../components/userCard";
import { useState, useEffect } from "react";

function UserSelectionPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadedContent, setLoadedContent] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    fetch("http://127.0.0.1:5000/get_set_users")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setIsLoading(false);
        let userContent = [];
        data.user_interaction_list.forEach((element) => {
          userContent.push(
            <div>
              <UserCard
                userId={element.user}
                interactions={element.interactions}
                topic_ex_list={element.topic_ex_list}
                topic_info={element.topic_info}
              ></UserCard>
            </div>
          );
        });
        setLoadedContent(userContent);
      });
  }, []);

  if (isLoading) {
    return <LoadingSpinner pageName="Kies een gebruiker" />;
  }

  return (
    <div>
      <Header pageName="Kies een gebruiker" />
      <div>{loadedContent}</div>
    </div>
  );
}

export default UserSelectionPage;
