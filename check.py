import json
import docker

with open('desired-state.json', 'r') as file:
    desired = json.load(file)

# print(f"Desired state: {desired}")

# print (f"Expected name: {desired['expected_tag']}")
# print (f"Expected version: {desired['service']}")

client = docker.from_env()
container = client.containers.get('26ffa32ef0c756c776855c22a8ab7a724dbaf4661f2c43ca3c096608caaf8a55')

taglist = container.image.tags 
imagename , imageversion = taglist[0].split(':', 1)

# print(f"Image name: {imagename}")
# print (f"Image version: {imageversion}")


if imagename == desired['service'] and imageversion == desired['expected_tag']:
    print(f"MATCH: {imagename} berjalan dengan versi yang tepat ({imageversion})")
elif imagename == desired['service'] and imageversion != desired['expected_tag']:
    print(f"MISMATCH: {imagename} berjalan dengan versi {imageversion}, seharusnya {desired['expected_tag']}")
else:
    print(f"ERROR: Service '{desired['service']}' tidak ditemukan berjalan di Docker.")
