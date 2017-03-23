$(function() {
	queue()
		.defer(d3.csv, "data/zeit_clean.csv")
		.defer(d3.json,"data/nyc_bg.geojson")
        .defer(d3.json, "data/nyc_outline.geojson")
        .defer(d3.json, "data/gidSecondsDictionary.json")
        .defer(d3.json, "data/points.json")
		.await(dataDidLoad);
})

$("#topDifferences .hideTop").hide()

function dataDidLoad(error,zeit,buildings,outline,idDictionary,points) {
//make 1 svg for everything
    var mapSvg = d3.select("#map").append("svg").attr("width",3000).attr("height",3000)
    //draw each layer
   // console.log(idDictionary)
    
  //  drawBuildings(outline,mapSvg,"outline",1,idDictionary)
    drawBuildings(buildings,mapSvg,"censusBlocks",1,idDictionary)
    

    //drawPathsZeit(zeit.splice(0,3000))
    
    //    drawPaths(points)
}

function drawBuildings(geoData,svg,className,opacity,idDictionary){
    //need to generalize projection into global var later
    var colors = ["#37b51f",
"#2cc18e",
"#5ab220",
"#1aac72",
"#3a6f18",
"#2ab53c",
"#1f7330",
"#69b743",
"#3f8938",
"#38bd5d",
"#6b9640",
"#50b468",
"#459521",
"#71b156",
"#26973e"]
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
		.style("stroke","none")
		.style("opacity",1)
	    .style("fill",function(d,i){
            
	        return colors[i%(colors.length-1)]
	    })

}
