# Create a Panic Room chart file from the notes of a Stepmania chart

f = open("notedata.txt")
rawdata = f.readlines()

print(rawdata)
data = []
group = [] # Temp. variable

for line in rawdata: # Prepare data for processing
    print(line)
    if line.strip().isdigit():
        group.append(line.strip())
    else:
        data.append(group)
        group = []
print(data)

def mstiming(bpm, measure, beat):
    beattime = 60000/bpm
    measuretime = 4*beattime
    return measuretime*measure + beattime*beat

def generate_note_data(data, offset, bpm, dspeed):
    measure = 0
    beat = 0
    out = []
    for item in data: # Measures ["0000","0000","0000","0000"]
        if len(item) == 4:
            for b in item: # Beats "0000"
                note_no = 0
                for note in b: # Notes "0"
                    note_no += 1
                    if note != "0":
                        out.append(f"new Note({round(mstiming(bpm, measure, beat))}, {note_no}, {dspeed}),")
            beat += 1

        if len(item) == 8:
            for b in item: # Beats "0000"
                note_no = 0
                for note in b: # Notes "0"
                    note_no += 1
                    if note != "0":
                        out.append(f"new Note({round(mstiming(bpm, measure, beat))}, {note_no}, {dspeed}),")
            beat += 0.5
                
        measure += 1
        beat = 0
        print(round(mstiming(bpm, measure, beat)))

    return out



for i in generate_note_data(data, 0, 193, 1):
    print(i)