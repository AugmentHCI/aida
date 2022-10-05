from DataHandler.DataHandler import DataHandler
from KnowledgeTracer.ATKT.ATKT_handler import ATKT_handler
from RecommenderSystem.RecommenderSystem import RecommenderSystem
from flask import Flask, request
from flask_restful import Api, Resource
from flask_cors import CORS
from flask_restful import reqparse
import json

app = Flask(__name__)
CORS(app)
api = Api(app)

# Retrieves topics on which the users can practice
class skill_retriever(Resource):
    def get(self):
        return database.get_topics()

# Retrieves a set of users together with interactions
class user_set_retriever(Resource):
    def get(self):
        return database.get_set_users()

# Class in charge of retrieving user skills
# - Receives the selected user id from front-end call
# - Returns user skills based on previous interactions
class get_user_skills(Resource):
    def get(self):
        args = request.args
        user_id = args["uid"]
        user_interaction_data = database.get_user_interaction_data(user_id)
        skills = knowledge_tracer.get_skills_user(user_interaction_data)
        return {"skills": skills}

# Class in charge of handling recommendations
# - Receives user skills from API & selected topics
# - Returns: list with recommended exercises & data needed fro why explanation
class get_recommendations(Resource):
    def get(self):
        args = request.args
        user_id = args["uid"]
        user_skills = args["uskills"]
        selected_topics = args["selectedTopics"]

        recommenderSystem.setTopics(json.loads(selected_topics))
        recommended_data = recommenderSystem.recommendExercises(json.loads(user_skills)["skills"])

        return recommended_data

api.add_resource(skill_retriever,"/get_topics")
api.add_resource(user_set_retriever,"/get_set_users")
api.add_resource(get_user_skills, "/get_user_skills")
api.add_resource(get_recommendations, "/get_recommendations")

if __name__ == '__main__':
    # Init db connection
    database = DataHandler()

    # Init knowledge tracer
    knowledge_tracer = ATKT_handler()

    # Init recommender system
    recommenderSystem = RecommenderSystem(database,5, knowledge_tracer)

    # run the app
    app.run(debug=True)