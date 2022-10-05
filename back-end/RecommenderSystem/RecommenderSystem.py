from DataHandler.DataHandler import DataHandler
from math import sqrt, pow
import json
import ast

class RecommenderSystem:
    def __init__(self, database, amountOfRecommendedExercises, knowledgeTracer):
        """
        On initialisation we set database connection, amount of exercises that should be recommended and the knowledge tracer
        :param database: database connection
        :param amountOfRecommendedExercises: amount of exercises to be recommended
        :param knowledgeTracer: knowledge tracer
        """
        self.database = database
        self.topicIdList = []
        self.topicNamesList = []
        self.amount = amountOfRecommendedExercises
        self.knowledgeTracer = knowledgeTracer

    def setTopics(self, topicsList):
        """
        Set topics for which the recommender needs to find recommendations
        :param topicsList: list of selected topics
        """
        idTopicList = []
        nameTopicList = []
        for topicL in topicsList:
            for topic in topicL["topic"]:
                idTopicList.append(topic["key"])
                nameTopicList.append({"key": topic["key"], "name": topic["onderwerp"], "deel": topic["chapter"]})

        self.topicNamesList = nameTopicList
        self.topicIdList = idTopicList

    def getNiveau(self, difficulty):
        """
        Transform difficulty value to string name
        :param difficulty: difficulty value
        :return: difficulty name
        """
        if difficulty<0.5:
            return "Gemakkelijk"
        elif difficulty >=0.5 and difficulty <0.65:
            return "Gemiddeld"
        elif difficulty >= 0.65 and difficulty < 0.8:
            return "Moeilijk"
        elif difficulty >= 0.8 and difficulty <=1:
            return "Zeer moeilijk"
        else:
            return "Nog geen niveau"

    def getAllExercises(self):
        """
        Retrieves all exercises from a list of topics
        :return: all exercises from a list of topics
        """
        result = self.database.getAllExercisesTopicList(self.topicIdList)
        exerciseList = set()
        for res in result:
            for ex in res:
                exerciseList.add(json.dumps({"skill_id":ex["skill_id"],"exercise": "exercise"+str(ex["ex_id"]), "difficulty": ex["difficulty"],"recommended": 0,"listInfo":{"key":ex["ex_id"],"oefeninginfo":{"deel":ast.literal_eval(ex["chapters"])[0],"onderwerp":ast.literal_eval(ex["chapters"])[1],"oefening":ex["ex_id"]}, "niveau":self.getNiveau(ex["difficulty"])}}))
        return list(exerciseList)

    def calculateSimilarity(self, userSkills, exerciseList):
        """
        Calculates the similarity (distance) between exercise & skill, orders based on similarity
        :param userSkills: skills level of the user for the selected topics
        :param exerciseList: list of exercises
        :return: ordered exercises list based on similiarity
        """
        newExerciseList = []
        for exercise in exerciseList:
            exercise = json.loads(exercise)
            similarity = sqrt(
                pow(float(exercise["difficulty"]) - float(userSkills[int(exercise["skill_id"]) - 1]["value"]), 2))
            exercise["similarity"] = similarity
            newExerciseList.append(exercise)

        newExerciseList = sorted(newExerciseList, key=lambda d: d["similarity"])
        return newExerciseList


    def get_level_name(self, level):
        """
        Transform user skill level value to string name
        :param level: user skill level value
        :return: user skill level name
        """
        if level < 0.5:
            return "Onvoldoende"
        elif level >= 0.5 and level < 0.7:
            return "Voldoende"
        elif level >= 0.7 and level < 0.9:
            return "Goed"
        elif level >= 0.9:
            return "Excellent"
        else:
            return "Unknown"

    def recommendExercises(self, userSkills):
        """
        In charge of recommendation flow
        :param userSkills: skills of user for selected topics
        :return: list of recommended exercises & data for waarom and what if explanation
        """
        # Sort user skill list
        userSkills = sorted(userSkills, key=lambda d: d['skill_id'])
        # Retrieve all exercises for the selected topics
        exerciseList = self.getAllExercises()
        # Calcualte similarity & add these values to the list, the list is also ordered so most similar are first
        exerciseList = self.calculateSimilarity(userSkills, exerciseList)

        # We get the first "amount" most similar exercises as recommended exercises
        rec_ex = []
        for i in range(self.amount):
            exerciseList[i]["recommended"] = 1
            rec_ex.append(exerciseList[i])

        # We also calculate values for what if explanation & add this
        updated_skills = self.knowledgeTracer.get_updated_skills(rec_ex)

        # We structure the data: {rec list, waarom data: list[{topic, deel, name, userskill, updatedskill,exercises list}]}
        waaromDataList = []
        for topic in self.topicIdList:
            userSkillLevel = userSkills[topic-1]["value"]
            userSkillName =  self.get_level_name(userSkills[topic-1]["value"])
            topicDeel= []
            topicName = []
            updatedUserSkillLevel = 0
            for topicInfo in self.topicNamesList:
                if topic == topicInfo["key"]:
                    topicName = topicInfo["name"]
                    topicDeel = topicInfo["deel"]

                    for uSkill in updated_skills:
                        if uSkill["skill_id"] == topicInfo["key"]:
                            updatedUserSkillLevel = uSkill["value"]

            exerciseByTopic = []
            for exercise in exerciseList:
                if exercise['skill_id'] == topic:
                    exerciseByTopic.append(exercise)
            waaromDataList.append({"skill":topic, "deel": topicDeel, "name": topicName,"userSkillLevel":userSkillLevel,"updatedUserSkillLevel":updatedUserSkillLevel,"userSkillName": userSkillName,"exercise_list":list(exerciseByTopic)})
        dataList = {"recommended_exercises": rec_ex, "waarom_data": waaromDataList}
        return dataList