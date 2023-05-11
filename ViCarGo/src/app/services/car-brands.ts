export class CarBrand {
  name: string;
  models: string[];

  constructor(name: string, models: string[]) {
    this.name = name;
    this.models = models;
  }
}

export const CAR_BRANDS: CarBrand[] = [
  new CarBrand('Abarth', ['595', '124 Spider']),
  new CarBrand('Acura', ['ILX', 'MDX', 'NSX', 'RDX', 'RLX', 'TLX']),
  new CarBrand('Aixam', ['City', 'Crossover', 'Coupé']),
  new CarBrand('Audi', ['A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q3', 'Q5', 'Q7', 'Q8', 'e-tron', 'RS3', 'RS4', 'RS5', 'RS6', 'RS7', 'RS Q3', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'SQ5', 'SQ7', 'TT', 'TTS', 'R8']),
  new CarBrand('Alfa Romeo', ['Giulia', 'Stelvio', '4C', 'Giulietta', 'Mito']),
  new CarBrand('Aston Martin', ['DB11', 'DBS Superleggera', 'Vantage', 'DBX', 'Rapide E']),
  new CarBrand('Bentley', ['Continental GT', 'Flying Spur', 'Bentayga', 'Mulsanne']),
  new CarBrand('BMW', ['1 Series', '2 Series', '3 Series', '4 Series', '5 Series', '6 Series', '7 Series', '8 Series', 'i3', 'i8', 'M2', 'M3', 'M4', 'M5', 'M6', 'X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7', 'Z4']),
  new CarBrand('Buick', ['Enclave', 'Encore', 'Encore GX', 'Envision', 'LaCrosse']),
  new CarBrand('Cadillac', ['CT4', 'CT5', 'CT6', 'Escalade', 'XT4', 'XT5', 'XT6']),
  new CarBrand('Chevrolet', ['Camaro', 'Corvette', 'Equinox', 'Malibu', 'Silverado', 'Suburban', 'Tahoe', 'Traverse', 'Volt']),
  new CarBrand('Citroen', ['C1', 'C2', 'C3', 'C4 Cactus', 'C5 Aircross','C6', 'C8', 'Berlingo']),
  new CarBrand('Cupra', ['Ateca', 'Leon', 'Formentor']),
  new CarBrand('Dacia', ['Sandero', 'Logan', 'Duster', 'Spring']),
  new CarBrand('Dodge', ['Charger', 'Challenger', 'Durango', 'Journey']),
  new CarBrand('Ferrari', ['812 Superfast', 'F8 Tributo', 'SF90 Stradale', 'Portofino M', 'Roma']),
  new CarBrand('Fiat', ['500', '500X', '500L', 'Panda', 'Tipo']),
  new CarBrand('Ford', ['Mustang', 'F-150', 'Explorer', 'Escape', 'Focus', 'Fiesta', 'Edge']),
  new CarBrand('Genesis', ['G70', 'G80', 'G90']),
  new CarBrand('GMC', ['Sierra 1500', 'Sierra 2500HD', 'Terrain', 'Yukon', 'Canyon']),
  new CarBrand('Honda', ['Civic', 'Accord', 'CR-V', 'HR-V', 'Odyssey', 'Passport', 'Pilot']),
  new CarBrand('Hyundai', ['Kona', 'Elantra', 'Sonata', 'Ioniq', 'Santa Fe', 'Tucson', 'Veloster']),
  new CarBrand("Infiniti", ["Q50", "Q60", "Q70", "QX30", "QX50", "QX60", "QX70", "QX80"]),
  new CarBrand("Jaguar", ["E-PACE", "F-PACE", "F-TYPE", "I-PACE", "XE", "XF", "XJ"]),
  new CarBrand("Jeep", ["Cherokee", "Compass", "Gladiator", "Grand Cherokee", "Renegade", "Wrangler"]),
  new CarBrand("Kia", ["Cadenza", "Forte", "K5", "K900", "Niro", "Optima", "Rio", "Sedona", "Seltos", "Sorento", "Soul", "Sportage", "Stinger"]),
  new CarBrand("Lamborghini", ["Aventador", "Huracán", "Urus"]),
  new CarBrand("Land Rover", ["Defender", "Discovery", "Discovery Sport", "Range Rover", "Range Rover Evoque", "Range Rover Sport", "Range Rover Velar"]),
  new CarBrand("Lexus", ["ES", "GX", "IS", "LC", "LS", "LX", "NX", "RC", "RX", "UX"]),
  new CarBrand("Lincoln", ["Aviator", "Continental", "Corsair", "MKZ", "Nautilus", "Navigator"]),
  new CarBrand("Maserati", ["Ghibli", "GranTurismo", "Levante", "Quattroporte"]),
  new CarBrand("Mazda", ["CX-3", "CX-30", "CX-5", "CX-9", "3", "6", "MX-5 Miata"]),
  new CarBrand("Mercedes-Benz", ["A-Class", "B-Class", "C-Class", "CLA", "CLC", "CLK", "CLS", "E-Class", "EQA", "EQB", "EQC", "EQE", "EQS", "EQV", "GLA", "GLB", "GLC", "GLE", "GLS", "S-Class"]),
  new CarBrand("Mini", ["Clubman", "Convertible", "Countryman", "Hardtop 2 Door", "Hardtop 4 Door"]),
  new CarBrand("Mitsubishi", ["Eclipse Cross", "Mirage", "Outlander", "Outlander Sport"]),
  new CarBrand("Nissan", ["370Z", "Altima", "Armada", "Frontier", "GT-R", "Kicks", "Leaf", "Maxima", "Murano", "Pathfinder", "Rogue", "Rogue Sport", "Sentra", "Titan", "Versa", "Versa Note"]),
  new CarBrand("Porsche", ["911", "Boxster", "Cayenne", "Cayman", "Macan", "Panamera"]),
  new CarBrand("Ram", ["1500", "2500", "3500"]),
  new CarBrand("Rolls-Royce", ["Cullinan", "Dawn", "Ghost", "Wraith"]),
  new CarBrand("Subaru", ["Ascent", "BRZ", "Crosstrek", "Forester", "Impreza", "Legacy", "Outback", "WRX"]),
  new CarBrand("Tesla", ["Model 3", "Model S", "Model X", "Model Y"]),
  new CarBrand("Toyota", ["4Runner", "Avalon", "C-HR", "Camry", "Corolla", "GR Supra", "Highlander", "Land Cruiser", "Mirai", "Prius", "RAV4", "Sequoia", "Sienna", "Tacoma", "Tundra", "Venza", "Yaris"]),
  new CarBrand("Volkswagen", ["Arteon", "Atlas", "Atlas Cross Sport", "Beetle", "Golf", "Jetta", "Passat", "Tiguan"]),
  new CarBrand("Volvo", ["S60", "S90", "V60", "V90", "XC40", "XC60", "XC90"])
];






