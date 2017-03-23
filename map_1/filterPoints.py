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


def loopPoints():
    with open("data/points_new.json") as f:
        nycPoints = []
        js =json.load(f)  
        for i in range(len(js)):
            #print js[i]
            point = Point(js[i]["lon"],js[i]["lat"])
 
            if loopPolygons(point)!= None:
                print js[i]
                js[i]["gid"]=loopPolygons(point)
                nycPoints.append(js[i])
        print nycPoints

def loopPolygons(point):
    with open("data/nyc_bg.geojson") as f:
        js =json.load(f)
        for i in range(len(js['features'])):
            feature = js['features'][i]
            polygon = shape(feature['geometry'])
            if polygon.contains(point)==True:
                return js['features'][i]["properties"]["GEOID"]
                #return True
                
                
loopPoints()