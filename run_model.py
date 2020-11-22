from joblib import dump, load
import pandas as pd
from sklearn.naive_bayes import MultinomialNB
from sklearn.feature_extraction.text import CountVectorizer
from sklearn import metrics
import json 
import pandas as pd 
import matplotlib.pyplot as plt 
import sys

def classifysentence(sentence,emdict): 
    emotion = ""
    count = dict()
    for key in emdict:
        if key in sentence[0]: 
            if key in count: 
                    count[key] += 1
            else: 
                count[key] = 1
    max_key = max(count)
    return max_key



def main(argv):
    if len(argv)==0: 
        return None 
    vectorizer = CountVectorizer(stop_words='english')
    tweets_data_path = 'tweetdata.txt'

    tweets_data = []
    tweets_file = open(tweets_data_path,'r')
    for line in tweets_file: 
        try:  
            tweet = json.loads(line)
            tweets_data.append(tweet)
        except:
            continue 
    
    #print("Tweet data length", len(tweets_data))
    sent = pd.read_excel('sentiment2.xlsx')
    #print("Data Head: ", sent.head())
    #print('Sent data length: ', len(sent))

    x = []
    y = []
    for i in range(len(tweets_data)): 
        if(tweets_data[i]['id']==sent['id'][i]): 
            x.append(tweets_data[i]['text'])
            y.append(sent['sentiment'][i])
    #print(x[0].split(" "))
    

    train_features = vectorizer.fit_transform(x)
    # print(y[0])
    emotional_keywords = ['anxiety', 'depression',
                          'sad', 'mad', 'anger', 'happy']

    model = load('sentiment_analyzer.joblib')

    #print("Args", argv)
    sentence = argv
    vector = vectorizer.transform(sentence)

    prediction = model.predict(vector)
    res = classifysentence(sentence,emotional_keywords)

    output = [prediction[0],res] 
    print(output)
    return output

if __name__ == "__main__":
    main(sys.argv[1:])
