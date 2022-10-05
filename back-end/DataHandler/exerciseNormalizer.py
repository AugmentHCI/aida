from pymongo import MongoClient

def getAllSkills(db):
    """
    Retrieve all topics from db
    :param db: database connection
    :return: list of skills
    """
    skill_collection = db["skills"]
    result = skill_collection.find({})

    skill_list = []

    for skill in result:
        print(skill)
        skill_list.append(skill["id"])

    return skill_list

def getAllExercisesOfSkill(db, skillId):
    """
    Retrieves all exercises of a specific skill
    :param db: database connection
    :param skillId: skill id
    :return: list of exerices
    """
    collection = db["exercises"]
    result = list(collection.find({"skill_id": skillId}))
    return result

def getMaxMinvalue(exercises):
    """
    Get min and max difficulty value
    :param exercises: exercise list
    :return: min and max difficulty value
    """
    max = -1
    min = 2
    for ex in exercises:
        diff = float(ex["difficulty"])
        if min > diff:
            min = diff
        if max < diff:
            max = diff
    return min, max

def normalizeDifficulties(db, skills):
    """
    Normalize exercise difficulties and update the in db (in new collection "new exercise collection)"
    :param db: database connections
    :param skills: skill ids
    """
    for skill in skills:
        exercises = getAllExercisesOfSkill(db, skill)
        min, max = getMaxMinvalue(exercises)

        print(min)
        for ex in exercises:
            #print(ex)
            diff = float(ex["difficulty"])
            normDiff = (diff - min) /(max - min)
            ex["difficulty"] = normDiff

        newCollection(db, exercises)

def newCollection(db, exercises):
    """
    Create new db collection and insert updated (normalized) exercise data
    :param db: database connection
    :param exercises: normalized exercises
    """
    col = db["new_exercise_collection"]
    for ex in exercises:
        col.insert_one(ex)

if __name__ == '__main__':
    # Run this to create the normalized exercise collection, check if the params of the db match your local settings
    MONGODB_HOST = 'localhost'
    MONGODB_PORT = 27017
    DB_NAME = 'AIDA_Nederlands1_db'
    cluster = MongoClient(MONGODB_HOST, MONGODB_PORT)
    db = cluster[DB_NAME]
    skills = getAllSkills(db)
    normalizeDifficulties(db,skills)
