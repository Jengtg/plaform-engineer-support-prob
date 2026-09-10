import json
import docker

with open('desired-state.json', 'r') as file:
    desired = json.load(file)

# print(f"Desired state: {desired}")

# print (f"Expected name: {desired['expected_tag']}")
# print (f"Expected version: {desired['service']}")

# untuk menconnect ke docker daemon atau menghubungkan dengan docket local
client = docker.from_env()
containers = client.containers.list(filters={"name": desired['service']})

# untuk mengecek apakah container dengan nama yang diinginkan berjalan atau tidak
if not containers:
    print("SERVICE TIDAK DITEMUKAN")
    exit() 
container = containers[0]

# untuk mendapatkan tag dan menparse nama dan versi image
taglist = container.image.tags 
imagename , imageversion = taglist[0].split(':', 1)

# print(f"Image name: {imagename}")
# print (f"Image version: {imageversion}")

# if else untuk mengecek apakah nama dan versi image sesuai dengan "desired"/ yang diingankan
if imagename == desired['service'] and imageversion == desired['expected_tag']:
    print(f"MATCH: {imagename} berjalan dengan versi yang tepat ({imageversion})")
elif imagename == desired['service'] and imageversion != desired['expected_tag']:
    print(f"MISMATCH: {imagename} berjalan dengan versi {imageversion}, seharusnya {desired['expected_tag']}")
else:
    print(f"ERROR: Service '{desired['service']}' tidak ditemukan berjalan di Docker.")
