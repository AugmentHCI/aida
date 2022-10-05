import pymongo
from pymongo import MongoClient
import json
from random import randrange


# Class in charge of database calls
class DataHandler:
    def __init__(self):
        MONGODB_HOST = 'localhost'
        MONGODB_PORT = 27017
        DB_NAME = 'AIDA_Nederlands1_db'
        self.cluster = MongoClient(MONGODB_HOST, MONGODB_PORT)
        self.db = self.cluster[DB_NAME]
        self.interaction_list = []

    def get_exercises(self, id):
        """
        We retrieve an exercises with a specific id
        :param id: the id of the exercise
        :return: a list containing the exercise (MongoDB always answers results in list format)
        """
        exercises_collection = self.db["exercises"]
        result = exercises_collection.find({"ex_id": id})
        return result

    def getAllExercisesTopicList(self, topicList):
        """
        Retrieves all exercises of a certain topic
        :param topicList: list of topics for which we need the exercises
        :return: list of exercises of a specific topic
        """
        exercises_collection = self.db["new_exercise_collection"]  # exercises
        resList = []
        for topicId in topicList:
            result = exercises_collection.find({"skill_id": topicId})
            resList.append(result)
        return resList

    def get_topics(self):
        """
        Get all topics of the course
        :return: a list containing objects with topics & extra info
        """
        # Get all topics
        skill_collection = self.db["skills"]
        result = skill_collection.find({})

        # We use set because we don't want duplicates (if there even exists duplicates)
        chapters = set()
        topics = []
        count = 1

        # Put result in right format, not that niveau="goed is outdated"
        for res in result:
            chapters.add(res["deel"])
            topics.append(
                {"chapter": res["deel"], "onderwerp": res["skill"], "voortgang": 50, "niveau": "goed", "key": count,
                 "skill_id": res["id"]})
            count += 1

        topics_json = {"chapters": list(chapters), "topics": topics}
        return topics_json

    def get_topic_id(self, topic):
        """
        Get id of a certain topic
        :param topic: topic (string)
        :return: id coupled to the topic in the db
        """
        skill_collection = self.db["skills"]
        result = skill_collection.find_one({"skill": topic})
        return result["id"]

    def get_random_users(self, amount):
        """
        Retrieves ids of "amount" amount of students
        :param amount: the amount of students we want interactiond ata from
        :return: list of interaction data
        """
        user_collection = self.db["users"]
        user_collection_size = user_collection.count_documents({})
        users = []

        for randomnr in range(amount):
            random_number = randrange(user_collection_size + 1)
            random_user = user_collection.find_one({"id": random_number})
            users.append(random_user)

        user1 = user_collection.find_one({"id": 1090})
        users.append(user1)
        user2 = user_collection.find_one({"id": 110})
        users.append(user2)

        return users

    def get_interaction_data_user_set(self, users):
        """
        Retrieves interaction data of students
        :param users: list of user ids
        :return: list of interaction data
        """
        interaction_collection = self.db["interactions"]
        interaction_data = []

        for user in users:
            user_interaction_data = interaction_collection.find({"id": user["id"]}).sort('scored_at', 1)
            interaction_data.append(user_interaction_data)
        return interaction_data

    def update_topic_ex_list(self, topicInfo, skill, interaction):
        """
        Needed in "kies gebruiker" page in UI: list with topics, exercise ids and amount of ex made: [{'topic': 'Wat voor een lezer ben jij?', 'exercise list': [46, 39, 16, 17, 40, 2], 'ex_made': 6}]
        This function is in charge of creating this
        :param topicInfo: topic info list
        :param skill: skill
        :param interaction: interactions of user
        :return: list with topicinfo, e.g.: [{'topic': 'Wat voor een lezer ben jij?', 'exercise list': [46, 39, 16, 17, 40, 2], 'ex_made': 6}]
        """
        if any(d["topic"] == skill and interaction["question_url"] in d["exercise list"] for d in topicInfo):
            print("skill available")
            # print(topicInfo)
        elif any(d["topic"] == skill and interaction["question_url"] not in d["exercise list"] for d in topicInfo):
            for info in topicInfo:
                info["exercise list"].append(interaction["question_url"])
                info["ex_made"] += 1
            print("updated: ", topicInfo)
        else:
            topicInfo.append({"topic": skill, "exercise list": [interaction["question_url"]], "ex_made": 1})

        return topicInfo

    def get_interaction_single_user(self, user_id, user_interaction_data):
        """
        In charge of structuring interaction data to be visualised in the UI
        :param user_id:  id of a user
        :param user_interaction_data:  interaction data of a user
        :return: structured interaction data
        TODO: refactor
        """
        interaction_list = []
        topic_ex_list = []
        skill_collection = self.db["skills"]
        exercise_collection = self.db["exercises"]
        for user_interactions in user_interaction_data:
            for interaction in user_interactions:
                if interaction["id"] == user_id:
                    skill = skill_collection.find_one({"id": interaction["chapters"]})["skill"]
                    exercise = exercise_collection.find_one({"ex_id": interaction["question_url"]})["question_url"]
                    interaction_list.append({"link": exercise, "ex_id": interaction["question_url"],
                                             "made_at": interaction["scored_at"], "score": interaction["score"],
                                             "max_score": interaction["max_score"], "topic": skill,
                                             "topic_id": interaction["chapters"]})

                    topic_ex_list = self.update_topic_ex_list(topic_ex_list, skill, interaction)

            user_interactions.rewind()

        ex_made_tot = 0
        total_topics = []
        for data in topic_ex_list:
            total_topics.append(data["topic"])
            ex_made_tot += data["ex_made"]

        topic_info = {"topics": total_topics, "amount_ex_made": ex_made_tot}

        return interaction_list, topic_ex_list, topic_info

    def jsonify_interaction_data_user_set(self, users, user_interaction_data):
        """
        For each user in the list retrieve interaction data & create the interaction list
        :param users: different user ids
        :param user_interaction_data: interaaction data of a user
        :return: interaction list
        """
        all_int_list = []
        for user in users:
            interaction_list, topic_ex_list, topic_info = self.get_interaction_single_user(user["id"],
                                                                                           user_interaction_data)
            all_int_list.append({"user": user["id"], "key": user['id'], "interactions": interaction_list,
                                 "topic_ex_list": topic_ex_list, "topic_info": topic_info})

        self.interaction_list = all_int_list

        return {"user_interaction_list": all_int_list}

    def get_set_users(self):
        """
        In charge of retrieving an amount of random user interaction data from the db and return it in a structured manner
        :return: Structured interaction data in JSON format to return in HTTP request
        """
        # First we get 5 users
        users = self.get_random_users(2)  # So 5 users in total

        # We retrieve the interaction data for each user
        interaction_data_users = self.get_interaction_data_user_set(users)

        # We structure the data to json format
        json_interaction_data = self.jsonify_interaction_data_user_set(users, interaction_data_users)

        print("finished")
        return json_interaction_data

    def get_user_interaction_data(self, user_id):
        """
        Function which returns use interactions from chosen student
        After user in UI has selected a student, the UI will do HTTP request for retrieving the skills of the user. Firstly the interaction data is retrieved
        :param user_id: id o fthe selected user
        :return: user interaction data
        """
        for user_interactions in self.interaction_list:
            if int(user_id) == user_interactions["user"]:
                return user_interactions["interactions"]