import { getLibId } from '../../service/flux/wallet';

export async function getLibIdController(_req: any, res: any) {
    try {
        const libId = await getLibId("flux");
        return res.status(200).json({
            success: true,
            libId: libId
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: 'Error al obtener el libId'
        });
    }
}