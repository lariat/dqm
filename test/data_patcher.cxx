#ifdef __APPLE__ 
#include <_types/_uint8_t.h> 
#include <_types/_uint16_t.h>
#include <_types/_uint32_t.h> 
#include <_types/_uint64_t.h> 
#else 
#include <stdint.h> 
#endif

#include <iostream>
#include <fstream>
#include <cassert>
#include <cstdio>
#include <vector>
#include <string>
#include <stdlib.h>

enum {
  V1740_N_CHANNELS = 64,
  V1740_N_SAMPLES = 1536,
  V1751_N_CHANNELS = 8,
  V1751_N_SAMPLES = 1792,
  MWPC_MAX_TDCS = 16,
  MWPC_MAX_HITS = 256,
  WUT_MAX_HITS = 128,
};

std::string remove_ext(std::string full_name) {
  int last_index = full_name.find_last_of(".");
  std::string raw_name = full_name.substr(0, last_index);
  return raw_name;
}

void parse(std::string file_path, std::string delimiter,
           std::vector<std::string> & token_vector) {
  size_t pos = 0;
  std::string token;
  while ((pos = file_path.find(delimiter)) != std::string::npos) {
    token = file_path.substr(0, pos);
    token_vector.push_back(token);
    file_path.erase(0, pos + delimiter.length());
  }
  token_vector.push_back(remove_ext(file_path));
}

std::string int_to_string(int i) {
  std::stringstream stringstream;
  std::string string;
  stringstream << i;
  stringstream >> string;
  return string;
}

int string_to_int(std::string string) {
  std::stringstream stringstream;
  int i;
  stringstream << string;
  stringstream >> i;
  return i;
}

void data_patcher (std::string input_file_path) {

    //std::cout << "Hello, World!" << std::endl;
    std::cout << input_file_path << std::endl;

    std::vector<std::string> token_vector;
    parse(input_file_path, "_", token_vector);

    std::cout << "Run:    " << token_vector.end()[-3] << std::endl;
    std::cout << "Spill:  " << token_vector.end()[-1] << std::endl;

    std::string output_dir = "./patched/";
    std::string output_file_path =
        output_dir + "dqm_run_" + token_vector.end()[-3] + "_spill_" +
        token_vector.end()[-1] + ".root";

    TFile * input_file = new TFile(input_file_path.c_str(), "READ");
    TTree * input_v1751_tree = (TTree *) input_file->Get("DataQuality/v1751");
    TTree * input_mwpc_tree = (TTree *) input_file->Get("DataQuality/mwpc");
    TTree * input_wut_tree = (TTree *) input_file->Get("DataQuality/wut");

    //TTree *     fCaenV1740DataTree;
    TTree *     fCaenV1751DataTree;
    TTree *     fWutDataTree;
    TTree *     fMwpcTdcDataTree;

    uint32_t spill = (uint32_t) string_to_int( token_vector.end()[-1] );
    //uint32_t spill;
    uint32_t caen_fragment;
    uint32_t caen_board_id;
    uint32_t caen_event_counter;
    uint32_t caen_trigger_time_tag;  // Each count in the V1751 trigger time tag is 8 ns
    //std::vector< std::vector<uint16_t> > caen_v1751_waveform;
    //std::vector< std::vector<uint16_t> > caen_v1740_waveform;
    uint16_t caen_v1751_channel_0[V1751_N_SAMPLES];
    uint16_t caen_v1751_channel_1[V1751_N_SAMPLES];
    uint16_t caen_v1751_channel_2[V1751_N_SAMPLES];
    uint16_t caen_v1751_channel_3[V1751_N_SAMPLES];
    uint16_t caen_v1751_channel_4[V1751_N_SAMPLES];
    uint16_t caen_v1751_channel_5[V1751_N_SAMPLES];
    uint16_t caen_v1751_channel_6[V1751_N_SAMPLES];
    uint16_t caen_v1751_channel_7[V1751_N_SAMPLES];

    uint32_t mwpc_trigger_counter;
    uint16_t mwpc_controller_time_stamp;
    uint32_t mwpc_tdc_time_stamp;
    uint32_t mwpc_number_hits;
    //std::vector<uint16_t> mwpc_tdc_number;
    //std::vector<uint16_t> mwpc_hit_channel;
    //std::vector<uint16_t> mwpc_hit_time_bin;
    uint16_t mwpc_tdc_number[MWPC_MAX_TDCS * MWPC_MAX_HITS];
    uint16_t mwpc_hit_channel[MWPC_MAX_TDCS * MWPC_MAX_HITS];
    uint16_t mwpc_hit_time_bin[MWPC_MAX_TDCS * MWPC_MAX_HITS];

    uint32_t wut_time_header;  // Each count in the time header is 16 us
    uint32_t wut_number_hits;
    //std::vector<uint16_t> wut_hit_channel;
    //std::vector<uint32_t> wut_hit_time_bin;
    uint16_t wut_hit_channel[4 * WUT_MAX_HITS];
    uint32_t wut_hit_time_bin[4 * WUT_MAX_HITS];

    //caen_v1751_waveform.resize(V1751_N_CHANNELS);
    //for (size_t i = 0; i < V1751_N_CHANNELS; ++i) {
    //  //caen_v1751_waveform[i].reserve(V1751_N_SAMPLES);
    //  caen_v1751_waveform[i] = 0;
    //}

    input_v1751_tree->SetBranchAddress("fragment", &caen_fragment);
    input_v1751_tree->SetBranchAddress("event_counter", &caen_event_counter);
    input_v1751_tree->SetBranchAddress("board_id", &caen_board_id);
    input_v1751_tree->SetBranchAddress("trigger_time_tag",
                                       &caen_trigger_time_tag);
    input_v1751_tree->SetBranchAddress("channel_0", caen_v1751_channel_0);
    input_v1751_tree->SetBranchAddress("channel_1", caen_v1751_channel_1);
    input_v1751_tree->SetBranchAddress("channel_2", caen_v1751_channel_2);
    input_v1751_tree->SetBranchAddress("channel_3", caen_v1751_channel_3);
    input_v1751_tree->SetBranchAddress("channel_4", caen_v1751_channel_4);
    input_v1751_tree->SetBranchAddress("channel_5", caen_v1751_channel_5);
    input_v1751_tree->SetBranchAddress("channel_6", caen_v1751_channel_6);
    input_v1751_tree->SetBranchAddress("channel_7", caen_v1751_channel_7);

    input_mwpc_tree->SetBranchAddress("trigger_counter",
                                      &mwpc_trigger_counter);
    input_mwpc_tree->SetBranchAddress("controller_time_stamp",
                                      &mwpc_controller_time_stamp);
    input_mwpc_tree->SetBranchAddress("tdc_time_stamp", &mwpc_tdc_time_stamp);
    input_mwpc_tree->SetBranchAddress("number_hits", &mwpc_number_hits);
    input_mwpc_tree->SetBranchAddress("tdc_number", mwpc_tdc_number);
    input_mwpc_tree->SetBranchAddress("hit_channel", mwpc_hit_channel);
    input_mwpc_tree->SetBranchAddress("hit_time_bin", mwpc_hit_time_bin);

    input_wut_tree->SetBranchAddress("time_header", &wut_time_header);
    input_wut_tree->SetBranchAddress("number_hits", &wut_number_hits);
    input_wut_tree->SetBranchAddress("hit_channel", wut_hit_channel);
    input_wut_tree->SetBranchAddress("hit_time_bin", wut_hit_time_bin);

    TFile * output_file = new TFile(output_file_path.c_str(), "RECREATE");

    TDirectory * dir = output_file->mkdir("DataQuality");
    dir->cd();

    TTree * fCaenV1751DataTree = new TTree("v1751", "v1751");
    fCaenV1751DataTree->Branch("spill", &spill, "spill/i");
    fCaenV1751DataTree->Branch("fragment", &caen_fragment, "fragment/i");
    fCaenV1751DataTree->Branch("event_counter", &caen_event_counter,
                               "event_counter/i");
    fCaenV1751DataTree->Branch("board_id", &caen_board_id, "board_id/i");
    fCaenV1751DataTree->Branch("trigger_time_tag", &caen_trigger_time_tag,
                               "trigger_time_tag/i");
    fCaenV1751DataTree->Branch("channel_0", caen_v1751_channel_0,
                               "channel_0[1792]/s");
    fCaenV1751DataTree->Branch("channel_1", caen_v1751_channel_1,
                               "channel_1[1792]/s");
    fCaenV1751DataTree->Branch("channel_2", caen_v1751_channel_2,
                               "channel_2[1792]/s");
    fCaenV1751DataTree->Branch("channel_3", caen_v1751_channel_3,
                               "channel_3[1792]/s");
    fCaenV1751DataTree->Branch("channel_4", caen_v1751_channel_4,
                               "channel_4[1792]/s");
    fCaenV1751DataTree->Branch("channel_5", caen_v1751_channel_5,
                               "channel_5[1792]/s");
    fCaenV1751DataTree->Branch("channel_6", caen_v1751_channel_6,
                               "channel_6[1792]/s");
    fCaenV1751DataTree->Branch("channel_7", caen_v1751_channel_7,
                               "channel_7[1792]/s");

    TTree * fMwpcTdcDataTree = new TTree("mwpc", "mwpc");
    fMwpcTdcDataTree->Branch("spill", &spill, "spill/i");
    fMwpcTdcDataTree->Branch("trigger_counter", &mwpc_trigger_counter,
                             "trigger_counter/i");
    fMwpcTdcDataTree->Branch("controller_time_stamp",
                             &mwpc_controller_time_stamp,
                             "controller_time_stamp/s");
    fMwpcTdcDataTree->Branch("tdc_time_stamp", &mwpc_tdc_time_stamp,
                             "tdc_time_stamp/i");
    fMwpcTdcDataTree->Branch("number_hits", &mwpc_number_hits, "number_hits/i");
    fMwpcTdcDataTree->Branch("tdc_number", mwpc_tdc_number,
                             "tdc_number[number_hits]/s");
    fMwpcTdcDataTree->Branch("hit_channel", mwpc_hit_channel,
                             "hit_channel[number_hits]/s");
    fMwpcTdcDataTree->Branch("hit_time_bin", mwpc_hit_time_bin,
                             "hit_time_bin[number_hits]/s");

    TTree * fWutDataTree = new TTree("wut", "wut");
    fWutDataTree->Branch("spill", &spill, "spill/i");
    fWutDataTree->Branch("time_header", &wut_time_header, "time_header/i");
    fWutDataTree->Branch("number_hits", &wut_number_hits, "number_hits/i");
    fWutDataTree->Branch("hit_channel", wut_hit_channel,
                         "hit_channel[number_hits]/s");
    fWutDataTree->Branch("hit_time_bin", wut_hit_time_bin,
                         "hit_time_bin[number_hits]/i");

    for (size_t i = 0; i < input_v1751_tree->GetEntries(); ++i) {
        input_v1751_tree->GetEntry(i);
        fCaenV1751DataTree->Fill();
    }

    for (size_t i = 0; i < input_mwpc_tree->GetEntries(); ++i) {
        input_mwpc_tree->GetEntry(i);
        fMwpcTdcDataTree->Fill();
    }

    for (size_t i = 0; i < input_wut_tree->GetEntries(); ++i) {
        input_wut_tree->GetEntry(i);
        fWutDataTree->Fill();
    }

    output_file->Write();

    return;
}
