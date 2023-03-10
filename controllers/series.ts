import { SeriesModel } from "../models/series";

export async function getAllSeries() {
    try {
        let series = await SeriesModel.find();
        return series;
    } catch (err) {
        return {
            error: true,
            errorMessage: `Error :${err}`
        }
    }
}


export async function getSeriesByDescription(desc: String) {
    try {
        let series = await SeriesModel.find({ seriesDesc: desc });
        
        return series[0]?.series;
    } catch (err) {
        return {
            error: true,
            errorMessage: `Error :${err}`
        }
    }
}
