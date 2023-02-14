import { Schema, model, Types } from 'mongoose';
import { ISeries } from '../interfaces/iSeries';

export const Series = new Schema<ISeries>({
    series: Number,
    seriesDesc: String
})

export const SeriesModel = model<ISeries>('Series', Series);