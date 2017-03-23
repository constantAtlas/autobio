# intersect.py
#
# Demonstrate how Shapely can be used to analyze and plot the intersection of
# a trajectory and regions in space.

from functools import partial
import random
import pprint
import pylab
import csv
import math
import json
from math import radians, cos, sin, asin, sqrt
from shapely.geometry import *
from shapely.ops import cascaded_union
from operator import itemgetter
import time
from datetime import timedelta
from datetime import datetime
#(40.7534561156999970 -73.9817047118999938)
pointLocation = Point(float(40.7534561156999970),float(-73.9817047118999938))
def loopTimeStamps():
    
    points = open("data/openpaths_jjjiia_withgid.csv","r")
    pointsReader = csv.reader(points)
    next(pointsReader)
    allPoints = []
    for line in pointsReader:
        allPoints.append(line)
        
    i=0
    durationList = []
    for row in allPoints:
        if i < len(allPoints)-1:
            row1 = row
            row2 = allPoints[i+1]
            i+=1
            startTimeStamp = row1[3]
            endTimeStamp = row2[3]
            startTime = datetime.strptime(startTimeStamp,"%Y-%m-%d %H:%M:%S")
            endTime = datetime.strptime(endTimeStamp,"%Y-%m-%d %H:%M:%S")
            duration = endTime-startTime
           # print row1[7], duration.total_seconds()
            durationList.append([row1[7],duration.total_seconds()])
   # print durationList
    
    dictionaryById = {}
    for entry in durationList:
        gid = entry[0]
        value = entry[1]
        if gid in dictionaryById.keys():
            newValue = dictionaryById[gid]+value
        else:
            dictionaryById[gid]=value
    print dictionaryById

def loopPolygons(point):
    with open("US_blockgroups.geojson") as f:
        js =json.load(f)
        for i in range(len(js['features'])):
            feature = js['features'][i]
            uid = feature["properties"]["GEOID"]
            polygon = shape(feature['geometry'])
            if polygon.contains(point)==True:
                return uid
            
loopTimeStamps()    
    