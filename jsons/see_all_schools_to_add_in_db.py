# -*- coding: utf-8 -*-

import mysql.connector as mysql
import json
import os

TELEOMA = "teleoma"
HOST = "localhost"

db = mysql.connect(host=HOST, user=TELEOMA, passwd=TELEOMA, database=TELEOMA)

def normalize(s):
	s = s.upper()
	pairs = [(u"Á", "A"), (u"É", "E"), (u"Í", "I"), (u"Ó", "O"), (u"Ú", "U"), (u"º", ""), (u"Ñ", u"N"), (u"`", "'"), (u"Ü", "U"), (u"´", "'"), (u"°", ""), (u"¨", '"'), (u"Â", "A"), (u"Ö", "O"), (u"Ì", "I"), (u"Û", "U"), (u"Ñ", u"N"), (u"Ï", "I"), (u"Í", "I"), (u"“", '"'), (u"”", '"'), (u"¡", "I"), (u"¤", "N"), (u"º", ""), (u"Ë", "E"), (u"È", "E"), (u"ª", ""), (u" ", " "), (u"À", "A"), (u"Ù", "U"), (u"Ò", "O"), (u"·", "")]
	for a, b in pairs:
		try: s=s.replace(a, b)
		except: pass
	return s

values = []
all_jsons_folder = "."
all_values = []
set_vals = set()
for province_folder_or_file in os.listdir(all_jsons_folder + "/provincias"):
	if ".json" in province_folder_or_file: continue
	print province_folder_or_file
	for department_folder_or_file in os.listdir(all_jsons_folder + "/provincias/" + province_folder_or_file):
		if ".json" in department_folder_or_file: continue
		for schools_file in os.listdir(all_jsons_folder + "/provincias/" + province_folder_or_file + "/" + department_folder_or_file):
			try:
				f=open(all_jsons_folder + "/provincias/" + province_folder_or_file + "/" + department_folder_or_file + "/" + schools_file)
			except:
				print "no pude abrir el archivo de ", province_folder_or_file, department_folder_or_file, schools_file
				continue
			data = json.load(f)
			for school in data:
				s = normalize(school)
				prov = normalize(province_folder_or_file)
				depto = normalize(department_folder_or_file)
				if s not in set_vals:
					values.append((s, prov, depto))
					set_vals.add(s)
					all_values.append(s)
	                                all_values.append(prov)
	                                all_values.append(depto)


SCHOOLS_TO_ADD = 50
offset = 0
schools_added_count = 0
while offset < len(all_values):
	chunk_values = all_values[offset:offset + SCHOOLS_TO_ADD * 3]
	cursor = db.cursor()
	mysql_query = "INSERT INTO schools (name, province, department) VALUES " + ", ".join("(%s, %s, %s)" for _ in xrange(SCHOOLS_TO_ADD))
	try:
		cursor.execute(mysql_query, chunk_values)
		db.commit()
		schools_added_count += len(chunk_values) / 3
		print "Van ", schools_added_count, "escuelas"
	except:
		mysql_query = "INSERT INTO schools (name, province, department) VALUES (%s, %s, %s)"
		for vidx in xrange(len(chunk_values) / 3):
			try:
				cursor.execute(mysql_query, (chunk_values[vidx*3], chunk_values[vidx*3+1], chunk_values[vidx*3+2]))
				db.commit()
				schools_added_count += 1
			except:
				print "No puedo meter ", chunk_values[vidx*3], chunk_values[vidx*3+1], chunk_values[vidx*3+2]
				pass
		pass
	offset += SCHOOLS_TO_ADD * 3
print "En total pude obtener {} de las cuales se agregaron {}".format(len(values), schools_added_count)
#query = u"insert into schools (name, province, department) values "
# query += u", ".join([u'("{}", "{}", "{}")'.format(x[0].replace('"', "").replace("'", ""), x[1].replace('"', "").replace("'", ""), x[2].replace('"', "").replace("'", "")) for x in values])
