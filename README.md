# Predictive Analysis of Used Car Values

### Project Description

This project seeks to predict prices for used vehicles in the automotive industry. Two main objectives of this project include: (1) analyzing which vehicle options are correlated with higher prices and (2) predicting used car prices over time. For the first objective, vehicle information is extracted from the used car market industry leader, Carmax, and car features most influential of a cars price are found. The second objective leverages machine learning to develop models capable of predicting used car prices, shedding light on what types of car options are most sought after by consumers.

### Repository Contents

### Code Library

##### Data Extraction: 

Web Scraping method that details the steps taken to extract and store data from Carmax using `NodeJS` and the `Playwright` JavaScript library. Initial storage method uses the `fs` library to set up a filesystem

##### Data Storage: 

Details the steps taken to store the extracted, semi-structured data in a data lake utilizing `Amazon S3` buckets.

##### Data Preparation: 

Details the steps taken to query the data lake and preprocess the raw data for analysis.

##### Data Exploration: 

The exploratory data analysis (EDA) phase examines visualizations, statistical summaries, and key insights derived from analyzing the dataset.

##### Modeling: 

Various machine learning models were applied to the preprocessed data, encompassing training, evaluation, and hyperparameter tuning. The outcomes and performance metrics for each model are detailed, offering a comprehensive summary of the modeling phase of the project.

### Data Folder

##### Data: 

The `data` folder comprises of the raw data utilized in the project, sourced from Carmax and organized in a file structure containing `date` folders containing `store_id` JSON files.

