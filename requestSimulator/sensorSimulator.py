import requests
import json
import random
import time

#Api endPoints 
apiGatewayURL = 'http://localhost:3000/api/'

#fakeSensor service route
fakeSensorRute = 'fakeSensor/'

#request header 
headers = {
  'Content-Type': 'application/json'
}

# Generate simulated sensor data with random numbers
# return { String } string calass of dictionary with sensor data 
def dataGenerator():
    dataObject = {
        'sensor':'SimulatedSensor',
        'data': [random.randrange(-1500, 1500) for _ in range(6)]
        }
    return json.dumps(dataObject)

#request counter
counter = 0
#start time
start_time = time.time()

while(True):
    # sensor data generated
    randomData = dataGenerator()
    #make a request and save the response 
    response = requests.post(
        apiGatewayURL+fakeSensorRute,
        headers=headers,
        data= randomData)
    counter+=1
    # Time elapsed from the beginning
    elapsed_time = time.time() - start_time
    print("---------------------------------------------------")
    print("Response: {}\ntotalRequest: {}\ntotalTime: {}\nrequestPerSecond: {}".format(response, counter, elapsed_time, counter/elapsed_time))
    print("---------------------------------------------------")
    #time.sleep(1)