#excel2json
echo Transform excel to dat-json with file output
start "excel2json" slv excel2json D:\data.xlsx -o ../result.txt
echo Close extra window
pause
cls

echo Transform excel to dat-json without file output
start "excel2json" slv excel2json D:\data.xlsx
echo Close extra window
pause

#dat-parse
echo Parse dat-file with file output
start "dat-parse" slv dat-parse ./cases/other/data0.dat -o ../result.txt
echo Close extra window
pause

echo Parse dat-file without file output
start "dat-parse" slv dat-parse ./cases/other/data0.dat
echo Close extra window
pause

#dat-serialize
echo Serialize dat-file with file output
start "dat-parse" slv dat-serialize ./cases/other/dat.json -o ../result.txt
echo Close extra window
pause

echo Serialize dat-file without file output
start "dat-parse" slv dat-serialize ./cases/other/dat.json
echo Close extra window
pause

#excel2dat
echo Transform excel to dat-file with file output
start "excel2dat" slv excel2dat D:\data.xlsx -o ../result.txt
echo Close extra window
pause

echo Transform excel to dat-file without file output
start "excel2dat" slv excel2dat D:\data.xlsx
echo Close extra window
pause
