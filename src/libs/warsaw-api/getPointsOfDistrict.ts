export default function getPointsOfDistrict(districtName: string): number {
    const pointsIndex: any = {
        'Śródmieście': 1,
        'Żoliborz': 1,
        'Ochota': 1,
        'Wola': 1,
        'Mokotów': 1,
        'Bielany': 1,
        'Praga Północ': 1,
        'Praga Południe': 1,
        'Włochy': 2,
        'Ursynów': 2,
        'Bemowo': 2,
        'Ursus': 3,
        'Wilanów': 3,
        'Białołęka': 3,
        'Targówek': 4,
        'Wawer': 4,
        'Rembertów': 4,
        'Wesoła': 4,
    }

    const pointsValue: number = pointsIndex[districtName] || 5

    return pointsValue
}