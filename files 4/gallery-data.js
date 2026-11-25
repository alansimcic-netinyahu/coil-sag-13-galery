// Photos come from Wikimedia Commons (free licences). Replace or add your own photos in assets/images/ if you wish.
// category: "city", "river" or "transport"
const WC = f => "https://commons.wikimedia.org/wiki/Special:FilePath/" + encodeURIComponent(f) + "?width=900";
const galleryPhotos = [
  {src:WC("Nova Gorica.jpg"),title:"Nova Gorica",description:"A planned city founded after 1947, close to the Italian border.",category:"city",author:"Wikimedia Commons"},
  {src:WC("The famous square Transalpina.jpg"),title:"Transalpina Square",description:"The border square shared with Gorizia: climate does not stop at borders.",category:"city",author:"Wikimedia Commons"},
  {src:WC("Nova Gorica 0720069 1600x1062 77.jpg"),title:"Green and urban",description:"Trees and open space help cool a city in hot summers.",category:"city",author:"Wikimedia Commons"},
  {src:WC("Nova Gorica (51589965143).jpg"),title:"City view",description:"Buildings use lots of energy: insulation and solar roofs can help.",category:"city",author:"Wikimedia Commons"},
  {src:WC("Nova Gorica (51590644950).jpg"),title:"Everyday streets",description:"Safe walking and cycling routes cut car emissions.",category:"city",author:"Wikimedia Commons"},
  {src:WC("Isonzo vicino Nova Gorica.jpg"),title:"The Soča (Isonzo)",description:"Rivers react to drought and heavy rain.",category:"river",author:"Wikimedia Commons"},
  {src:WC("Soča river (14806521534).jpg"),title:"Clean water",description:"Healthy rivers need protected nature and less pollution.",category:"river",author:"Wikimedia Commons"},
  {src:WC("Nova Gorica 0720069 71.jpg"),title:"Road bridge over the river",description:"Roads connect us, but road transport is a big source of CO₂.",category:"transport",author:"Wikimedia Commons"},
  {src:WC("Solkan railway bridge 01.jpg"),title:"Solkan railway bridge",description:"A famous stone arch bridge: trains are a low-carbon way to travel.",category:"transport",author:"Wikimedia Commons"},
  {src:WC("Nova Gorica Solkan Eisenbahnbruecke ueber die Soca 120720069 1600x1062 88.jpg"),title:"Rail over the Soča",description:"Old infrastructure can serve a greener future.",category:"transport",author:"Wikimedia Commons"},
  {src:WC("20240805 Slowenien Nova Gorica Bahnhof Umbau Bahnsteig.jpg"),title:"Station rebuild",description:"Upgrading the railway station makes train travel easier.",category:"transport",author:"Wikimedia Commons"},
  {src:WC("20240805 Slowenien Nova Gorica Bahnhof Umbau Übersicht.jpg"),title:"Station overview",description:"Better public transport means fewer cars on the road.",category:"transport",author:"Wikimedia Commons"}
];
