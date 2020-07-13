import json
import os

def normalize(s):
	s = s.upper()
	pairs = [(u"Á", "A"), (u"É", "E"), (u"Í", "I"), (u"Ó", "O"), (u"Ú", "U"), (u"º", ""), (u"Ñ", u"N"), (u"`", "'"), (u"Ü", "U"), (u"´", "'"), (u"°", ""), (u"¨", '"'), (u"Â", "A"), (u"Ö", "O"), (u"Ì", "I"), (u"Û", "U"), (u"Ñ", u"N"), (u"Ï", "I"), (u"Í", "I"), (u"“", '"'), (u"”", '"'), (u"¡", "I"), (u"¤", "N"), (u"º", ""), (u"Ë", "E"), (u"È", "E"), (u"ª", ""), (u" ", " "), (u"À", "A"), (u"Ù", "U"), (u"Ò", "O"), (u"·", "")]
	for a, b in pairs:
		try: s=s.replace(a, b)
		except: pass
	return s

values = []
all_jsons_folder = "."
for province_folder_or_file in os.listdir(all_jsons_folder + "/provincias"):
	if ".json" in province_folder_or_file: continue
	for department_folder_or_file in os.listdir(all_jsons_folder + "/provincias/" + province_folder_or_file):
		if ".json" in department_folder_or_file: continue
		for schools_file in os.listdir(all_jsons_folder + "/provincias/" + province_folder_or_file + "/" + department_folder_or_file):
			try:
				f=open(all_jsons_folder + "/provincias/" + province_folder_or_file + "/" + department_folder_or_file + "/" + schools_file)
			except: continue
			data = json.load(f)
			for school in data:
				s = normalize(school)
				prov = normalize(province_folder_or_file)
				depto = normalize(department_folder_or_file)
				values.append((s, prov, depto))

query = u"insert into schools (name, province, department) values "
# query += u", ".join([u'("{}", "{}", "{}")'.format(x[0].replace('"', "").replace("'", ""), x[1].replace('"', "").replace("'", ""), x[2].replace('"', "").replace("'", "")) for x in values])
