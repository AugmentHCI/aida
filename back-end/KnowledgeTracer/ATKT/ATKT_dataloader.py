import numpy as np
import pandas as pd
import torch

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

class DATA(object):
    def __init__(self, n_question, seqlen, separate_char, maxstep, name="data"):
        """
        On initialisation we set amount of question, max sequence length etc
        """
        self.separate_char = separate_char
        self.n_question = n_question
        self.seqlen = seqlen
        self.maxstep = maxstep

    def load_data_single_student(self, interaction_data):
        """
        Transforms retrieved data to correct form
        :param interaction_data: interaction data as retrieved from db
        :return: transformed list
        """
        #Note: need to return sth in the form of: [[skill1, skill2, skill3, skill4, ...]], [[answer1, answer2, answer3, answer4, ...]]
        skill_list = []
        answer_list = []
        for interaction in interaction_data:
            skill_list.append(interaction["topic_id"]-1)
            if interaction['score'] >= interaction['max_score']/2 :
                answer_list.append(1)
            else:
                answer_list.append(0)

        mod = 0 if len(skill_list) % self.maxstep == 0 else (self.maxstep - len(skill_list) % self.maxstep)
        interaction_length = len(skill_list)
        # Increase to maxstep: -1 for not made
        for j in range(mod):
            skill_list.append(-1)
            answer_list.append(-1)

        skill_list, answer_list = np.array(skill_list).astype(np.int).reshape([-1, self.maxstep]), np.array(answer_list).astype(np.int).reshape(
            [-1, self.maxstep])

        print(skill_list)
        print(answer_list)

        skill_list = torch.LongTensor(skill_list)
        answer_list = torch.LongTensor(answer_list)
        skill_list = torch.where(skill_list == -1, torch.tensor([22]), skill_list)
        answer_list = torch.where(answer_list == -1, torch.tensor([2]), answer_list)
        skill_list, answer_list = skill_list.to(device), answer_list.to(device)


        return skill_list, answer_list, interaction_length