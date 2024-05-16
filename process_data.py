import pandas as pd
import geopandas as gpd
import zipfile
import os

# Paths to the uploaded files
transit_zip_path = 'data/google_transit.zip'
park_amenities_geojson_path = 'data/Park_Amenities.geojson'
parks_geojson_path = 'data/Parks.geojson'

# Extract GTFS data
with zipfile.ZipFile(transit_zip_path, 'r') as zip_ref:
    zip_ref.extractall('data/google_transit')

# Load GeoJSON data
park_amenities_gdf = gpd.read_file(park_amenities_geojson_path)
parks_gdf = gpd.read_file(parks_geojson_path)

# Display sample data
print(park_amenities_gdf.head())
print(parks_gdf.head())

# Convert selected GTFS files to CSV
gtfs_files = ['stops.txt', 'routes.txt', 'trips.txt', 'stop_times.txt', 'calendar.txt']
for file in gtfs_files:
    file_path = f'data/google_transit/{file}'
    if os.path.exists(file_path):
        df = pd.read_csv(file_path)
        df.to_csv(f'data/{file.replace(".txt", ".csv")}', index=False)

print("GTFS data extracted and GeoJSON files loaded successfully.")