import argparse

import cv2


# set video file path of input video with name and extension
def extract_frames(path_video_file, path_output_frames, ratio_frame_to_saved_frame):
    video_capturer = cv2.VideoCapture(path_video_file)
    success, image = video_capturer.read()
    count = 0
    while success:
        if (count % ratio_frame_to_saved_frame) == 0:
            cv2.imwrite(path_output_frames + 'image_' + str(count) + '.jpg', image)
            print('Saved frame: ', count, success)

        success, image = video_capturer.read()
        count += 1


if __name__ == '__main__':
    path_video_file = 'data/test_videos/cardboard/test.mp4'
    path_output_frames = 'data/test_videos/cardboard/'
    ratio_frame_to_saved_frame = 50

    my_parser = argparse.ArgumentParser()

    my_parser.add_argument('-in', dest='path_video_file')
    my_parser.add_argument('-out', dest='path_output_frames')
    my_parser.add_argument(
        '-rate', dest='ratio_frame_to_saved_frame',
        type=int,
        default=50,
    )

    args = my_parser.parse_args()

    extract_frames(
        args.path_video_file,
        args.path_output_frames,
        args.ratio_frame_to_saved_frame,
    )
