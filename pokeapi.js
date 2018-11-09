const Promise = require('bluebird');
const axios = require('axios');

const url = 'http://api.population.io:80/1.0/';
const year = 2017;
const country = 'Belarus';

axios.get(url + `population/${year}/${country}/`)
    .then(function (response) {
        // handle success
        const population = response.data;
        let allPopulation = 0;
        for (let someAged of population) {
            allPopulation += someAged.total;
        }
        console.log();
        console.log("Axios.get");
        console.log(`Population of Belarus is ${allPopulation}`);
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    })

const allYear = 2017;

const allUrls = [
    url + `population/${allYear}/Canada/`,
    url + `population/${allYear}/Germany/`,
    url + `population/${allYear}/France/`
];

Promise.all(allUrls.map(url => axios.get(url)))
    .then(results => {
        const population = results;
        let malePopulation = 0;
        let femalePopulation = 0;
        for (let someCountry of population) {
            const countryPopulation = someCountry.data;
            for (let someAged of countryPopulation) {
                malePopulation += someAged.males;
                femalePopulation += someAged.females;
            }
        }
        const country = population[0].country;
        console.log();
        console.log("Promise.all");
        console.log(`Female population of countries is ${femalePopulation}`);
        console.log(`Male population of countries is ${malePopulation}`);
    });

const anyCountry = 'Belarus';
const age = 25;

const urlsPopulation = [
    url + `/population/2014/${anyCountry}/${age}/`,
    url + `/population/2015/${anyCountry}/${age}/`
];

Promise.any(urlsPopulation.map(url => axios.get(url)))
    .then(results => {
        const population = results.data;
        let malePopulation = 0;
        let femalePopulation = 0;
        for (let people of population) {
            malePopulation += people.males;
            femalePopulation += people.females;
        }
        const year = population[0].year;
        console.log();
        console.log("Promise.any");
        console.log(`${age} y.o. female population in ${year} of ${anyCountry} is ${femalePopulation}`);
        console.log(`${age} y.o. male population in ${year} of ${anyCountry} is ${malePopulation}`);
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    })

let population = axios.create({
    baseURL: 'http://api.population.io:80/1.0/mortality-distribution/',
});

let urlsGreece = [];
let urlsTurkey = [];

urlsGreece.push(`Greece/male/0/today/`);
urlsTurkey.push(`Turkey/male/0/today/`);
urlsGreece.push(`Greece/female/0/today/`);
urlsTurkey.push(`Turkey/female/0/today/`);

function getMortalityAge(countryMortality) {
    let maxPercent = 0;
    let maxAge = 0;
    for (ageMortality of countryMortality) {
        if (ageMortality.mortality_percent > maxPercent) {
            maxPercent = ageMortality.mortality_percent;
            maxAge = ageMortality.age;
        }
    }
    return maxAge;
}

Promise.props({
    greece: Promise.all(urlsGreece.map(population.get)),
    turkey: Promise.all(urlsTurkey.map(population.get))
}).then(function (result) {
    const maxGreeceAge = [];
    const maxTurkeyAge = [];
    for (let i = 0; i < 2; i++) {
        const greeceMortality = result.greece[i].data.mortality_distribution;
        const turkeyMortality = result.turkey[i].data.mortality_distribution;
        maxGreeceAge.push(getMortalityAge(greeceMortality));
        maxTurkeyAge.push(getMortalityAge(turkeyMortality));
    }
    console.log();
    console.log("Promise.props");
    console.log(`Greece max mortality age for males ${maxGreeceAge[0]} for females ${maxGreeceAge[1]}`);
    console.log(`Turkey max mortality age for males ${maxTurkeyAge[0]} for females ${maxTurkeyAge[1]}`);
}
);

const yearA = 2007;

axios.get(url + 'countries').then(results => {
    const allCountries = results.data.countries;
    const countries = [];
    for (let i = 0; i < 5; i++) {
        countries.push(url + `population/${yearA}/${allCountries[i]}/`);
    }
    console.log();
    console.log("Promise.map");
    Promise.map(axios.get(countries)).then(result => {
        const population = results;
        for (let someCountry of population) {
            let totalPopulation = 0;
            const countryPopulation = someCountry.data;  
            for (let someAged of countryPopulation) {
                totalPopulation += someAged.total;
            }
            console.log(`Population of ${someCountry.country} is ${totalPopulation}`);
        }
    })
})