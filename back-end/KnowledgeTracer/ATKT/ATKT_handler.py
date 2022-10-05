from KnowledgeTracer.ATKT.ATKT_dataloader import DATA
from KnowledgeTracer.ATKT.ATKT_params import params_atkt
from KnowledgeTracer.ATKT.ATKT_model import KT_backbone
import torch
import numpy as np

class ATKT_handler:
    def __init__(self):
        """
        On init we set params, dataloader, load params of trained knowledge tracer, set it on evaluating mode, set interaction data on empty list
        """
        self.params = params_atkt
        self.dataloader = DATA(n_question=params_atkt.n_skill, seqlen=params_atkt.seqlen, separate_char=',', maxstep=500)
        self.model = KT_backbone(params_atkt.skill_emb_dim, params_atkt.answer_emb_dim, params_atkt.hidden_emb_dim, params_atkt.n_skill)
        self.model.load_state_dict(torch.load(params_atkt.model_path))
        self.model.eval()
        self.userInteractionData = []

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

    def get_skills_user(self, interaction_data):
        """
        Retrieve the skills of the user based on the interaction data
        :param interaction_data: interaction data of the user
        :return: list containing skill levels of user
        """
        # Store in the instance itself
        self.userInteractionData = interaction_data

        # Load the data: transform to the requested structure
        skill_data, answer_data, interaction_len = self.dataloader.load_data_single_student(interaction_data)

        # Retrieve predictions
        skill_user, _ = self.model.forward_final_skill_pred(skill_data,answer_data, interaction_len)
        skill_user = np.array(torch.detach(skill_user))
        skill_user = skill_user.reshape(-1)

        # Transform data so can be used in fron-end or rec sys
        dictified_skill_user = []
        count = 1
        for level in skill_user:
            dictified_skill_user.append({"skill_id": count, "value": float(level), "name": self.get_level_name(level)})
            count += 1

        return dictified_skill_user

    def get_updated_skills(self, new_data):
        """
        For what if explanation, update interaction array, get new predictions
        :param new_data: hypothetical interaction data, we add the recommended exercises to the interaction data as correctly made
        :return: new skill leves
        """
        updatedInteractionData = self.userInteractionData

        for data in new_data:
            updatedInteractionData.append({"topic_id":data["skill_id"],"score":1,"max_score":1})

        skills = self.get_skills_user(updatedInteractionData)
        return skills