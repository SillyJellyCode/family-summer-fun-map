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

# List the extracted GTFS files
gtfs_files = os.listdir('data/google_transit')
print("Extracted GTFS files:", gtfs_files)

# Load the GTFS data into DataFrames
agency_df = pd.read_csv('data/google_transit/agency.txt')
calendar_df = pd.read_csv('data/google_transit/calendar.txt')
calendar_dates_df = pd.read_csv('data/google_transit/calendar_dates.txt')
feed_info_df = pd.read_csv('data/google_transit/feed_info.txt')
routes_df = pd.read_csv('data/google_transit/routes.txt')
shapes_df = pd.read_csv('data/google_transit/shapes.txt')
stop_times_df = pd.read_csv('data/google_transit/stop_times.txt')
stops_df = pd.read_csv('data/google_transit/stops.txt')
transfers_df = pd.read_csv('data/google_transit/transfers.txt')
trips_df = pd.read_csv('data/google_transit/trips.txt')

# Display sample data
print("Agency Data:")
print(agency_df.head())
print("Calendar Data:")
print(calendar_df.head())
print("Routes Data:")
print(routes_df.head())
print("Stops Data:")
print(stops_df.head())
print("Trips Data:")
print(trips_df.head())

# Load GeoJSON data
park_amenities_gdf = gpd.read_file(park_amenities_geojson_path)
parks_gdf = gpd.read_file(parks_geojson_path)

# Display sample GeoJSON data
print("Park Amenities GeoJSON Data:")
print(park_amenities_gdf.head())
print("Parks GeoJSON Data:")
print(parks_gdf.head())

# Save GTFS data to CSV (optional, for further processing)
agency_df.to_csv('data/agency.csv', index=False)
calendar_df.to_csv('data/calendar.csv', index=False)
calendar_dates_df.to_csv('data/calendar_dates.csv', index=False)
feed_info_df.to_csv('data/feed_info.csv', index=False)
routes_df.to_csv('data/routes.csv', index=False)
shapes_df.to_csv('data/shapes.csv', index=False)
stop_times_df.to_csv('data/stop_times.csv', index=False)
stops_df.to_csv('data/stops.csv', index=False)
transfers_df.to_csv('data/transfers.csv', index=False)
trips_df.to_csv('data/trips.csv', index=False)

print("GTFS data extracted and saved as CSV files.")
print("GeoJSON files loaded successfully.")


# Filter stops to include only those weithin a specific area (latitude and longitude bounds)
latitude_bounds = (42.9, 43.0)
longitude_bounds = (-81.3, -81.2)

filtered_stops_df = stops_df[
    (stops_df['stop_lat'] >= latitude_bounds[0]) & 
    (stops_df['stop_lat'] <= latitude_bounds[1]) & 
    (stops_df['stop_lon'] >= longitude_bounds[0]) & 
    (stops_df['stop_lon'] <= longitude_bounds[1])
]

print("Filtered Stops Data:")
print(filtered_stops_df.head())

# Save filtered stops data to CSV
filtered_stops_df.to_csv('data/filtered_stops.csv', index=False)
