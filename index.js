const educationUrl = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"
const countryUrl = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"


let countryData;
let educationData;



const svg = d3.select(".container")
              .append("svg")
              .attr("width", 1000)
              .attr("height", 600)

const divTooltip = d3.select("body")
                    .append("div")
                    .attr("class", "tooltip")
                    .attr("id", "tooltip")
                    .style("opacity", 0)
             
                   
const drawMap =()=>{
        svg.selectAll('path')
            .data(countryData)
            .enter()
            .append("path")
            .attr("d", d3.geoPath())
            .attr("class", "county")
            .attr("fill", (datCounty)=>{
                    let id = datCounty.id
                    const county = educationData.find((d)=>{
                      return  d.fips === id
                    })
                    let percentage = county.bachelorsOrHigher
                    
                    if(percentage<= 10){
                        return "#e5e8ff"
                    }else if(percentage<=20){
                        return "#b8beff"
                    }else if(percentage<=30){
                        return "#808cff"
                    }else{
                        return "#000747"
                    }
            })
            .attr("data-fips", (datCounty)=>{
                let id = datCounty.id
             return id
        })
            .attr("data-education", (datCounty)=>{
                let id = datCounty.id
                const county = educationData.find((d)=>{
                  return  d.fips === id
                })
             return county.bachelorsOrHigher
        })
            .on("mouseover", function(event, datCounty){
                let id = datCounty.id
                const county = educationData.find((d)=>{
                  return  d.fips === id
                })
                divTooltip.style("opacity", 0.9)
                          .html(
                            county.area_name +', '+ county.state +', '+ county.bachelorsOrHigher +'%'
                          )
                          .style("left", event.pageX +"px")
                          .style("top", event.pageY -28+"px")
                          .attr("data-education", county.bachelorsOrHigher)
            })
            .on("mouseout", ()=>{
                divTooltip.style("opacity", 0)
            })
}


d3.json(countryUrl).then(
    (data, error)=>{
        if(error){
            console.log(error)
        }else{
            countryData = topojson.feature(data, data.objects.counties).features
            console.log(countryData)

            d3.json(educationUrl).then(
                (data,error)=>{
                    if(error){
                        console.log(error)
                    }else{
                        educationData = data
                        console.log(educationData)
                        drawMap();
                    }
                }
            )
        }
    }
)




