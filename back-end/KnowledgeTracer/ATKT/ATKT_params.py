import argparse

parser_atkt = argparse.ArgumentParser()

# ATKT parser, contains all parameters needed for training/testing/using the knowledge tracer
parser_atkt.add_argument('--max_iter', type=int, default=150, help='number of iterations') # 150 normally
parser_atkt.add_argument('--seed', type=int, default=224, help='default seed')
parser_atkt.add_argument('--lr', type=float, default=0.001, help='Initial learning rate.')
parser_atkt.add_argument('--gamma', type=float, default=0.5, help='LR decay factor.')
parser_atkt.add_argument('--lr-decay', type=int, default=50, help='After how epochs to decay LR by a factor of gamma.')
parser_atkt.add_argument('--hidden-emb-dim', type=int, default=80, help='Dimension of concept embedding.')
parser_atkt.add_argument('--skill-emb-dim', type=int, default=256)
parser_atkt.add_argument('--answer-emb-dim', type=int, default=96)
parser_atkt.add_argument('--dataset', type=str, default="sequential_db")
parser_atkt.add_argument('--beta', type=float, default=0.2)
parser_atkt.add_argument('--epsilon', type=float, default=10)
parser_atkt.add_argument('--n_skill', type=int, default=22)
parser_atkt.add_argument('--batch_size', type=int, default=24)
parser_atkt.add_argument('--seqlen', type=int, default=200)
parser_atkt.add_argument('--model_path', type=str, default='/Users/arnovanneste/Documents/AIDA data/03-05-2022 batch/Nederlands 1/atkt_model.pt')

def get_args_atkt():
    return parser_atkt.parse_args()

params_atkt = get_args_atkt()

if __name__ == "__main__":
    params_atkt = get_args_atkt()