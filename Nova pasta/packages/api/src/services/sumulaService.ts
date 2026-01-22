import { api } from "../client/axios";
import { loadingStateManager } from "../utils/loading";
import { ApiRequestConfig, ExportSumulaPDF, Sumula } from "../types";

class SumulaService {
    constructor(private readonly endpoint = "sumula") {}

    async extractFromPdf(files: ExportSumulaPDF, config?: ApiRequestConfig): Promise<Sumula> {
        loadingStateManager.startLoading(SUMULA_LOADING_KEYS.EXTRACT_FROM_PDF);

        try {
            const formData = new FormData();
            formData.append('sumulaEstudoFile', files.sumulaEstudoFile);
            
            if (files.sumulaRepacFile) {
                formData.append('sumulaRepacFile', files.sumulaRepacFile);
            }

            const response = await api.post<Sumula>(`${this.endpoint}/extract-pdf`, formData, {
                ...config,
                headers: {
                    ...config?.headers,
                    'Content-Type': 'multipart/form-data',
                },
            });

            loadingStateManager.stopLoading(SUMULA_LOADING_KEYS.EXTRACT_FROM_PDF);
            return response.data;
        } catch (error) {
            loadingStateManager.stopLoading(SUMULA_LOADING_KEYS.EXTRACT_FROM_PDF, error as any);
            throw error;
        }
    }
}

export const SUMULA_LOADING_KEYS = {
    EXTRACT_FROM_PDF: "sumula:extractFromPdf",
};

export const sumulaService = new SumulaService();
