export interface IImage {
    id: number;
    url: string;
    path: string;
}

export interface ISpecialization {
    id: number;
    title: string;
}

export interface IPortfolioItem {
    id: number;
    description: string;
    images: IImage[];
}

export enum WorkMode {
    ONLINE = 'online',
    OFFLINE = 'offline',
    BOTH = 'both',
}

export interface ICoachProfile {
    id: number;
    description: string;
    specializations: ISpecialization[];
    portfolioItems: IPortfolioItem[];
    experience: number;
    city: string;
    workMode: WorkMode;
}

export interface IImage {
    path: string;
    url: string;
}

export interface IUser {
    id: number;
    name: string;
    email: string;
    password: string;
    profileImage: IImage;
    coachProfile?: ICoachProfile;
}


export interface UserState {
    user: IUser | null;
    loading: boolean;
    error: string | null;
}
