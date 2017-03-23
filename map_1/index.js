$(function() {
	queue()
		.defer(d3.csv, "data/zeit_clean.csv")
		.defer(d3.json,"data/nyc_bg.geojson")
        .defer(d3.json, "data/nyc_outline.geojson")
        .defer(d3.json, "data/gidSecondsDictionary.json")
        .defer(d3.json, "data/points_new_nyc.json")
		.await(dataDidLoad);
})

$("#topDifferences .hideTop").hide()

function dataDidLoad(error,zeit,buildings,outline,idDictionary,points) {
//make 1 svg for everything
    var w = window.innerWidth;
    var h = window.innerHeight;
    var mapSvg = d3.select("#map").append("div")
   .classed("svg-container", true) //container class to make it responsive
   .append("svg").attr("width",w).attr("height",h)

    
    drawBuildings(outline,mapSvg,"outline",1,idDictionary)
    drawBuildings(buildings,mapSvg,"censusBlocks",1,idDictionary)
    

   // drawPathsZeit(zeit.splice(0,3000))
    
        drawPaths(points)
    d3.select("#fade").on("click",function(){
    d3.selectAll("path").transition().duration(10000).style("stroke-opacity",0)
        
    })
    
}
var nyc = [-73.92,40.75]
var projection = d3.geo.mercator().scale(90000).center(nyc)
function calculateTimeDifference(time1, time2){
    
    console.log([time1,time2])
}
function drawPaths(points){
    
    var array = [1,2,3,4,5,6]
    var line = d3.svg.line()
        .y(function(d) { 
            var lat = parseFloat(d.lat)
            var lng = parseFloat(d.lon)
            var projectedLat = projection([lng,lat])[1]
            return projectedLat
            return Math.random() * 1000 
            })
        .x(function(d) {
            var lat = parseFloat(d.lat)
            var lng = parseFloat(d.lon)
            var projectedLon = projection([lng,lat])[0]
            return projectedLon
        });
    
    var startPointLat = points[0].lat
    var startPointLng = points[0].lon
    var projectedLat = projection([startPointLng,startPointLat])[0]
    var projectedLng = projection([startPointLng,startPointLat])[1]
        
    //calculateTimeDifference(time1, time2)    
    
    var svg = d3.select("#map svg")
    var g = svg.append("g")           
        .attr("transform","translate("+projectedLat+","+projectedLng+")")

    var marker = g.append("circle").attr("class","marker");
         marker.attr("r", 7).attr("fill","none")

    var path = svg.selectAll(".paths")
        .append("path")
        .attr("d", line(points))
        .attr("class", "line")
        .style("stroke", "red" )
        .style("fill","none")
        .style("opacity",.01)
        .style("stroke-width",.4)
    
    blink()

var timeScale = d3.scale.linear().domain([0,60*60*2]).range([0,1000])
var cScale = d3.scale.linear().domain([0,24*60*6]).range(["#fff","red"])

     var segment = 0
var wait =0
    var totalTime=0
var maxTime = 0
var startOpacity = 1

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
     for(var i in points){
             
     //        setTimeout(function() {
                var point = points[segment]
                var lat = parseFloat(point.lat)
                var lng = parseFloat(point.lon)
                var projectedLat = projection([lng,lat])[0]
                var projectedLng = projection([lng,lat])[1]
        
                 if (segment!= 0){
                     wait = points[segment].t - points[0].t
                     segmentWait = points[segment].t - points[segment-1].t
                 }
                 else{
                     wait = 60
                     segmentWait = 0
                 }
                 if( maxTime < segmentWait ){
                     maxTime =  segmentWait
                 }
                 var opacityScale = d3.scale.linear().domain([0,24*60*60]).range([0,1])
                 var colorScale = d3.scale.linear().range([0,24*60*60]).domain(["#fff","#000"])
                 
         
                 var geoId = points[segment].gid
                var oldOpacity = parseFloat(d3.select("._"+geoId).style("opacity"))
                
                    d3.select("#time").html(points[segment].t)
                 
              //  console.log(oldOpacity) 
                 d3.select("._"+geoId)
                 .transition()
                 //.duration(100)
                 .delay(timeScale(wait)+20)
                 .style("fill","black")
                 .style("opacity",function(){
                    oldOpacity = oldOpacity +.1
                    d3.select("._"+geoId).style("opacity", oldOpacity+.1)
                    return oldOpacity
                 })
                 
                 g.transition()
                 .duration(200)
                 .delay(timeScale(wait))
                 .attr("transform",function () {
                     return "translate("+projectedLat+","+projectedLng+")";
                 })
                 //console.log(segment + ", "+projectedLat+", "+projectedLng+", "+ wait[segment]);
                 segment++                 
//             }, wait[segment-1]*1000) 
            // console.log(wait)
     }
     
     function blink(){
         marker.style("r",8).style("opacity",.7).style("stroke-width",2)
         .transition().style("stroke","red").style("opacity",0.5)
         .duration(200).style("r",6.5)
         .transition()
         .duration(300).style("opacity",.7).style("r",8)
         .each("end", blink);
     }
     
     
     function translateAlong(path) {
        var l = path.getTotalLength();
        return function(i) {
          return function(t) {
              var p = path.getPointAtLength(t * l);
            return "translate(" + p.x + "," + p.y + ")";//Move marker
          }
        }
      }    
//    var totalLength = 300   
//    path.attr("stroke-dasharray", totalLength + " " + totalLength*200)
//        .attr("stroke-dashoffset", totalLength*200)
//        .transition()
//        .duration(100000)
//        .ease("linear")
//        .attr("stroke-dashoffset", -totalLength*20);
        
}
function drawOutline(geoData,svg,className,opacity,idDictionary){
    //need to generalize projection into global var later
	var projection = d3.geo.mercator().scale(150000).center([-74,40.8])
    //d3 geo path uses projections, it is similar to regular paths in line graphs
	var path = d3.geo.path().projection(projection);
    //push data, add path
    console.log(Object.keys(idDictionary))
    var oScale = d3.scale.linear().domain([0,2000]).range([0.2,1])
    var cScale = d3.scale.linear().domain([0,24*60*6]).range(["#fff","red"])
	svg.selectAll(".buildings")
		.data(geoData.features)
        .enter()
        .append("path")
		.attr("class",className)
		.attr("d",path)
		.style("stroke","#000")
		.style("opacity",1)
	    .style("fill",function(d){
	      return "none"
	    })
        .style("stroke-width",.2)
        .on("mouseover",function(){
        //    var co = d3.select(this).style("opacity")
        //    console.log(co)
        //    var no = parseFloat(co)+.05
        //    d3.select(this).style("opacity",no)
        //    console.log(no)
        //    
        })
        .on("mouseout",function(){
            
        })
}
function drawBuildings(geoData,svg,className,opacity,idDictionary){
    //need to generalize projection into global var later
    //d3 geo path uses projections, it is similar to regular paths in line graphs
	var path = d3.geo.path().projection(projection);
    //push data, add path
    var oScale = d3.scale.linear().domain([0,2000]).range([0.2,1])
    var cScale = d3.scale.linear().domain([0,24*60*6]).range(["#fff","red"])
	svg.selectAll(".buildings")
		.data(geoData.features)
        .enter()
        .append("path")
		.attr("class",function(d){return "_"+d.properties.GEOID})
		.attr("d",path)
		.style("stroke",function(d){
	        var id = String(d.properties.GEOID)
            var value = idDictionary[id]
            if(value == undefined){
                return "#000"
            }else{
                //return "red"
                return "#fff"
                
                return cScale(value)
            }
		})
		.style("opacity",.1)
	    .style("fill",function(d){
         //   console.log(d)
	        var id = String(d.properties.GEOID)
            var value = idDictionary[id]
            if(value == undefined){
                return "#fff"
            }else{
                return "#fff"
                //return "red"
                return cScale(value)
            }
	    })
        .style("stroke-width",.5)
        .on("mouseover",function(d){
            console.log(d3.select(this).style("opacity"))
        })
      
}

function drawDots(data,svg){
	var projection = d3.geo.mercator().scale(4000000).center([-71.063,42.3562])
    
    svg.selectAll(".dots")
        .data(data)
        .enter()
        .append("circle")
        .attr("class","dots")
        .attr("r",2)
        .attr("cx",function(d){
            var lat = parseFloat(d.latitude)
            var lng = parseFloat(d.longitude)
            //to get projected dot position, use this basic formula
            var projectedLng = projection([lng,lat])[0]
            return projectedLng
        })
        .attr("cy",function(d){
            var lat = parseFloat(d.latitude)
            var lng = parseFloat(d.longitude)
            var projectedLat = projection([lng,lat])[1]
            return projectedLat
        })
        .attr("fill",function(d){
            //color code the dots by gender
            var gender = d.gender
            if(gender == "F"){
                return "red"
            }else if(gender == "M"){
                return "blue"
            }else{
                return "black"
            }            
        })
	    .style("opacity",.3)
        //on mouseover prints dot data
        .on("mouseover",function(d){
            console.log(d)
        })
        
}